import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SecurityService } from '../security/security.service';
import { CryptoUtil } from '../common/utils/crypto.util';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRoleType, PrivacyMode } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  // In-memory fallback store for dev environment when Postgres isn't running
  private memoryUsers = new Map<string, any>();
  private memorySessions = new Map<string, any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
    private readonly securityService: SecurityService,
  ) {
    this.initDemoMemoryUsers();
  }

  private async initDemoMemoryUsers() {
    const hashed = await CryptoUtil.hashPassword('SopetPilot2026!');
    const users = [
      {
        id: 'usr-amina-demo',
        email: 'amina@example.com',
        passwordHash: hashed,
        fullName: 'Amina (Pilot Participant)',
        roles: ['USER'],
        permissions: ['goal.read_own', 'goal.create', 'goal.update_own', 'action.read_own', 'action.create', 'barrier.read_own'],
        privacyMode: 'STANDARD_PRIVATE',
        isActive: true,
      },
      {
        id: 'usr-support-demo',
        email: 'support@sopet.local',
        passwordHash: hashed,
        fullName: 'SOPET Support Specialist',
        roles: ['SUPPORT_ADMIN'],
        permissions: ['account.metadata.view', 'security.sessions.view', 'admin.metrics.view'],
        privacyMode: 'STANDARD_PRIVATE',
        isActive: true,
      },
      {
        id: 'usr-security-demo',
        email: 'security@sopet.local',
        passwordHash: hashed,
        fullName: 'SOPET Security Lead',
        roles: ['SECURITY_ADMIN'],
        permissions: ['security.sessions.view', 'security.sessions.revoke', 'security.events.view', 'admin.metrics.view'],
        privacyMode: 'STANDARD_PRIVATE',
        isActive: true,
      },
      {
        id: 'usr-owner-demo',
        email: 'owner@sopet.local',
        passwordHash: hashed,
        fullName: 'SOPET System Owner',
        roles: ['SYSTEM_OWNER'],
        permissions: ['*'],
        privacyMode: 'STANDARD_PRIVATE',
        isActive: true,
      },
    ];
    for (const u of users) {
      this.memoryUsers.set(u.email.toLowerCase(), u);
    }
  }

  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    const email = dto.email.toLowerCase().trim();

    // Check existing
    if (this.prisma.isConnected) {
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new ConflictException('An account with this email already exists');
      }
    } else if (this.memoryUsers.has(email)) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await CryptoUtil.hashPassword(dto.password);
    const userId = 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const privacyMode = (dto.privacyMode || 'STANDARD_PRIVATE') as PrivacyMode;

    let createdUser: any;

    if (this.prisma.isConnected) {
      const userRole = await this.prisma.role.findUnique({ where: { name: UserRoleType.USER } });
      createdUser = await this.prisma.user.create({
        data: {
          id: userId,
          email,
          passwordHash,
          fullName: dto.fullName || 'SOPET Participant',
          privacyMode,
          isActive: true,
          profile: {
            create: {
              displayName: dto.fullName || 'SOPET Participant',
            },
          },
          userRoles: userRole ? { create: { roleId: userRole.id } } : undefined,
          notificationPref: {
            create: {},
          },
        },
        include: {
          userRoles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        },
      });
    } else {
      createdUser = {
        id: userId,
        email,
        passwordHash,
        fullName: dto.fullName || 'SOPET Participant',
        privacyMode,
        roles: ['USER'],
        permissions: ['goal.read_own', 'goal.create', 'goal.update_own', 'action.read_own', 'action.create'],
        isActive: true,
      };
      this.memoryUsers.set(email, createdUser);
    }

    await this.auditService.log({
      actorId: userId,
      actorEmail: email,
      action: 'USER_REGISTERED',
      targetId: userId,
      targetType: 'USER',
      ipAddress,
      userAgent,
      result: 'SUCCESS',
    });

    const tokens = await this.generateTokens(createdUser, ipAddress, userAgent);
    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        fullName: createdUser.fullName,
        roles: createdUser.roles || ['USER'],
        privacyMode: createdUser.privacyMode,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const email = dto.email.toLowerCase().trim();

    // Brute-force rate check
    if (this.securityService.isRateLimited(`login:${email}`, 5, 300000)) {
      await this.securityService.recordSecurityEvent({
        eventType: 'BRUTE_FORCE_SUSPECTED',
        severity: 'HIGH',
        ipAddress,
        userAgent,
        details: { email },
      });
      throw new BadRequestException('Too many failed login attempts. Please wait 5 minutes before retrying.');
    }

    let user: any;
    if (this.prisma.isConnected) {
      user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      user = this.memoryUsers.get(email);
    }

    if (!user || !user.isActive) {
      this.securityService.recordFailedLogin(`login:${email}`);
      await this.auditService.log({
        actorEmail: email,
        action: 'USER_LOGIN_FAILED',
        reason: 'User not found or inactive',
        ipAddress,
        userAgent,
        result: 'FAILURE',
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await CryptoUtil.verifyPassword(user.passwordHash, dto.password);
    if (!isValid) {
      const attempts = this.securityService.recordFailedLogin(`login:${email}`);
      await this.securityService.recordSecurityEvent({
        userId: user.id,
        eventType: 'FAILED_LOGIN',
        severity: attempts >= 3 ? 'MEDIUM' : 'LOW',
        ipAddress,
        userAgent,
      });
      await this.auditService.log({
        actorId: user.id,
        actorEmail: email,
        action: 'USER_LOGIN_FAILED',
        reason: 'Incorrect password',
        ipAddress,
        userAgent,
        result: 'FAILURE',
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // MFA Verification if enabled
    if (user.mfaEnabled) {
      if (!dto.totpCode) {
        return {
          mfaRequired: true,
          tempSessionId: user.id,
        };
      }
      // Simple TOTP validator demo (accepts 6-digit number or test code)
      if (dto.totpCode.length !== 6) {
        throw new UnauthorizedException('Invalid MFA authentication code');
      }
    }

    this.securityService.clearFailedLogins(`login:${email}`);

    // Update lastLoginAt
    if (this.prisma.isConnected) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    const roles = user.roles || user.userRoles?.map((ur: any) => ur.role.name) || ['USER'];
    const permissions =
      user.permissions ||
      user.userRoles?.flatMap((ur: any) => ur.role.permissions.map((p: any) => p.permission.code)) ||
      [];

    const tokens = await this.generateTokens(
      {
        id: user.id,
        email: user.email,
        roles,
        permissions,
        privacyMode: user.privacyMode,
      },
      ipAddress,
      userAgent,
    );

    await this.auditService.log({
      actorId: user.id,
      actorEmail: email,
      action: 'USER_LOGGED_IN',
      targetId: user.id,
      targetType: 'USER',
      ipAddress,
      userAgent,
      result: 'SUCCESS',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
        permissions,
        privacyMode: user.privacyMode,
      },
      ...tokens,
    };
  }

  async refreshToken(rawRefreshToken: string, ipAddress?: string, userAgent?: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret') || 'sopet_dev_jwt_refresh_secret_2026_super_secure',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const hashedIncoming = CryptoUtil.hashToken(rawRefreshToken);
    const sessionId = payload.sessionId;

    if (this.prisma.isConnected && sessionId) {
      const session = await this.prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          user: {
            include: {
              userRoles: {
                include: { role: { include: { permissions: { include: { permission: true } } } } },
              },
            },
          },
        },
      });

      if (!session || session.isRevoked || session.expiresAt < new Date()) {
        await this.securityService.recordSecurityEvent({
          userId: payload.sub,
          eventType: 'REVOKED_SESSION_REFRESH_ATTEMPT',
          severity: 'HIGH',
          ipAddress,
          userAgent,
        });
        throw new UnauthorizedException('Session expired or revoked');
      }

      // Refresh token rotation check: if stored hash doesn't match, reuse is detected!
      if (session.refreshTokenHash !== hashedIncoming) {
        // Invalidate entire session family for security
        await this.prisma.session.update({
          where: { id: session.id },
          data: { isRevoked: true },
        });
        await this.securityService.recordSecurityEvent({
          userId: session.userId,
          eventType: 'REFRESH_TOKEN_REUSE_DETECTED',
          severity: 'CRITICAL',
          ipAddress,
          userAgent,
        });
        throw new UnauthorizedException('Security violation: token reuse detected');
      }

      // Rotate token: update session with new refresh token hash
      const newRawToken = CryptoUtil.generateSecureToken(48);
      const signedRefreshToken = this.jwtService.sign(
        { sub: session.user.id, sessionId: session.id, tokenNonce: newRawToken },
        {
          secret: this.configService.get<string>('jwt.refreshSecret') || 'sopet_dev_jwt_refresh_secret_2026_super_secure',
          expiresIn: (this.configService.get<string>('jwt.refreshTtl') || '7d') as any,
        },
      );
      const newHash = CryptoUtil.hashToken(signedRefreshToken);

      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          refreshTokenHash: newHash,
          lastActiveAt: new Date(),
        },
      });

      const roles = session.user.userRoles?.map((ur: any) => ur.role.name) || ['USER'];
      const permissions =
        session.user.userRoles?.flatMap((ur: any) => ur.role.permissions.map((p: any) => p.permission.code)) || [];

      const newAccessToken = this.jwtService.sign(
        {
          sub: session.user.id,
          email: session.user.email,
          roles,
          permissions,
          sessionId: session.id,
          privacyMode: session.user.privacyMode,
        },
        {
          secret: this.configService.get<string>('jwt.accessSecret') || 'sopet_dev_jwt_access_secret_2026_super_secure',
          expiresIn: (this.configService.get<string>('jwt.accessTtl') || '15m') as any,
        },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: signedRefreshToken,
      };
    } else {
      // Memory fallback rotation
      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email || 'amina@example.com',
          roles: payload.roles || ['USER'],
          permissions: payload.permissions || [],
          sessionId,
        },
        {
          secret: this.configService.get<string>('jwt.accessSecret') || 'sopet_dev_jwt_access_secret_2026_super_secure',
          expiresIn: '15m',
        },
      );
      const signedRefreshToken = this.jwtService.sign(
        { sub: payload.sub, sessionId },
        {
          secret: this.configService.get<string>('jwt.refreshSecret') || 'sopet_dev_jwt_refresh_secret_2026_super_secure',
          expiresIn: '7d',
        },
      );
      return {
        accessToken: newAccessToken,
        refreshToken: signedRefreshToken,
      };
    }
  }

  async logout(sessionId?: string, userId?: string) {
    if (sessionId && this.prisma.isConnected) {
      await this.prisma.session.updateMany({
        where: { id: sessionId },
        data: { isRevoked: true },
      });
    }
    if (userId) {
      await this.auditService.log({
        actorId: userId,
        action: 'USER_LOGOUT',
        targetId: sessionId,
        targetType: 'SESSION',
      });
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async logoutAllSessions(userId: string) {
    if (this.prisma.isConnected) {
      await this.prisma.session.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
    }
    await this.auditService.log({
      actorId: userId,
      action: 'ALL_SESSIONS_REVOKED',
      targetId: userId,
      targetType: 'USER',
    });
    return { success: true, message: 'All active sessions have been revoked' };
  }

  private async generateTokens(user: any, ipAddress?: string, userAgent?: string) {
    const sessionId = 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const rawNonce = CryptoUtil.generateSecureToken(48);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const refreshToken = this.jwtService.sign(
      { sub: user.id, sessionId, tokenNonce: rawNonce },
      {
        secret: this.configService.get<string>('jwt.refreshSecret') || 'sopet_dev_jwt_refresh_secret_2026_super_secure',
        expiresIn: (this.configService.get<string>('jwt.refreshTtl') || '7d') as any,
      },
    );
    const hashedToken = CryptoUtil.hashToken(refreshToken);

    if (this.prisma.isConnected) {
      await this.prisma.session.create({
        data: {
          id: sessionId,
          userId: user.id,
          refreshTokenHash: hashedToken,
          userAgent,
          ipAddress,
          expiresAt,
        },
      });
    } else {
      this.memorySessions.set(sessionId, {
        id: sessionId,
        userId: user.id,
        refreshTokenHash: hashedToken,
        userAgent,
        ipAddress,
        expiresAt,
        isRevoked: false,
      });
    }

    const payload: any = {
      sub: user.id,
      email: user.email,
      roles: user.roles || ['USER'],
      permissions: user.permissions || [],
      sessionId,
      privacyMode: user.privacyMode || 'STANDARD_PRIVATE',
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret') || 'sopet_dev_jwt_access_secret_2026_super_secure',
      expiresIn: (this.configService.get<string>('jwt.accessTtl') || '15m') as any,
    });

    return {
      accessToken,
      refreshToken,
      sessionId,
      expiresIn: 900, // 15 mins
    };
  }
}
