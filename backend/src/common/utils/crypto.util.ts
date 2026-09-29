import * as argon2 from 'argon2';
import * as crypto from 'crypto';

export class CryptoUtil {
  /**
   * Hashes a password using Argon2id with memoryCost=65536, timeCost=3, parallelism=1.
   */
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });
  }

  /**
   * Verifies a password against an Argon2id hash.
   */
  static async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  /**
   * Hashes a refresh token or recovery code using SHA-256 for secure storage.
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a random crypto-secure token (for email verification, reset, or refresh tokens).
   */
  static generateSecureToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Redacts private or sensitive fields from objects before logging.
   * Explicitly strips passwords, tokens, private goal text, barrier explanations, and reflection notes.
   */
  static sanitizeForLogs(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    const sensitiveKeys = [
      'password',
      'passwordHash',
      'token',
      'refreshToken',
      'mfaSecret',
      'whyItMatters',
      'userExplanation',
      'meaningfulProgress',
      'whatGotInTheWay',
      'lessonText',
      'notes',
      'ciphertextPayload',
    ];

    if (Array.isArray(obj)) {
      return obj.map((item) => CryptoUtil.sanitizeForLogs(item));
    }

    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        cleaned[key] = '[REDACTED_FOR_PRIVACY]';
      } else if (value && typeof value === 'object') {
        cleaned[key] = CryptoUtil.sanitizeForLogs(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
}
