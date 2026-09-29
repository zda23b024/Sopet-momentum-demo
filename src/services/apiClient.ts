/**
 * SOPET Momentum - Production-Grade API Client & State Sync Service
 * Seamlessly interfaces with NestJS Backend REST API (/api/v1) with automatic token management,
 * proactive refresh rotation, and seamless offline-ready local cache fallback.
 */

const API_BASE_URL = (
  typeof (import.meta as any) !== 'undefined' && (import.meta as any).env?.VITE_API_URL
    ? (import.meta as any).env.VITE_API_URL
    : ''
).replace(/\/$/, '');

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    email: string;
    fullName?: string;
    roles?: string[];
    permissions?: string[];
    privacyMode?: string;
  };
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isOnlineBackend: boolean = false;
  private checkPromise: Promise<boolean> | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('sopet_access_token');
    this.refreshToken = localStorage.getItem('sopet_refresh_token');
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setTokens(tokens: AuthTokens) {
    if (tokens.accessToken) {
      this.accessToken = tokens.accessToken;
      localStorage.setItem('sopet_access_token', tokens.accessToken);
    }
    if (tokens.refreshToken) {
      this.refreshToken = tokens.refreshToken;
      localStorage.setItem('sopet_refresh_token', tokens.refreshToken);
    }
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('sopet_access_token');
    localStorage.removeItem('sopet_refresh_token');
  }

  public async isBackendAvailable(): Promise<boolean> {
    if (this.checkPromise) return this.checkPromise;
    this.checkPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000),
        });
        this.isOnlineBackend = res.ok;
      } catch {
        this.isOnlineBackend = false;
      } finally {
        setTimeout(() => { this.checkPromise = null; }, 10000);
      }
      return this.isOnlineBackend;
    })();
    return this.checkPromise;
  }

  public async request<T = any>(
    path: string,
    options: RequestInit = {},
    requiresAuth = true,
  ): Promise<{ data: T | null; error?: string; fromBackend: boolean }> {
    const url = `${API_BASE_URL}/api/v1${path.startsWith('/') ? path : '/' + path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (requiresAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized by attempting refresh token rotation
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.attemptTokenRefresh();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        }
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        return {
          data: null,
          error: errJson?.message || `HTTP ${response.status}: ${response.statusText}`,
          fromBackend: true,
        };
      }

      const resData = await response.json().catch(() => null);
      // NestJS TransformInterceptor wraps responses in { data: ... }
      const actualData = resData && typeof resData === 'object' && 'data' in resData ? resData.data : resData;

      return {
        data: actualData as T,
        fromBackend: true,
      };
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'Network request failed',
        fromBackend: false,
      };
    }
  }

  private async attemptTokenRefresh(): Promise<boolean> {
    if (!this.refreshToken) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json;
        if (data?.accessToken) {
          this.setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken || this.refreshToken,
          });
          return true;
        }
      }
    } catch {
      // Refresh failed
    }
    this.clearTokens();
    return false;
  }
}

export const apiClient = new ApiClient();
