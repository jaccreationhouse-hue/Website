import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export interface TokenClaims {
  sub: string;
  tenantId: string;
  siteIds: string[];
  permissions: string[];
}

export interface SignedTokenClaims extends TokenClaims {
  jti: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function decode<T>(value: string): T {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;
}

export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtlSeconds: number;
  private readonly refreshTtlSeconds: number;

  constructor(
    accessSecret: string,
    refreshSecret: string,
    accessTtlSeconds: number,
    refreshTtlSeconds: number
  ) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
    this.accessTtlSeconds = accessTtlSeconds;
    this.refreshTtlSeconds = refreshTtlSeconds;
  }

  issueAccessToken(claims: TokenClaims, now = Math.floor(Date.now() / 1000)): string {
    return this.issue(claims, 'access', this.accessSecret, this.accessTtlSeconds, now);
  }

  issueRefreshToken(claims: TokenClaims, now = Math.floor(Date.now() / 1000)): string {
    return this.issue(claims, 'refresh', this.refreshSecret, this.refreshTtlSeconds, now);
  }

  verifyAccessToken(token: string, now = Math.floor(Date.now() / 1000)): SignedTokenClaims {
    return this.verify(token, 'access', this.accessSecret, now);
  }

  verifyRefreshToken(token: string, now = Math.floor(Date.now() / 1000)): SignedTokenClaims {
    return this.verify(token, 'refresh', this.refreshSecret, now);
  }

  get accessExpiresInSeconds(): number {
    return this.accessTtlSeconds;
  }

  private issue(
    claims: TokenClaims,
    type: SignedTokenClaims['type'],
    secret: string,
    ttl: number,
    now: number
  ): string {
    const header = encode({ alg: 'HS256', typ: 'JWT' });
    const payload = encode({ ...claims, jti: randomUUID(), type, iat: now, exp: now + ttl });
    const signature = this.sign(`${header}.${payload}`, secret);
    return `${header}.${payload}.${signature}`;
  }

  private verify(
    token: string,
    expectedType: SignedTokenClaims['type'],
    secret: string,
    now: number
  ): SignedTokenClaims {
    const [header, payload, signature, extra] = token.split('.');
    if (!header || !payload || !signature || extra) {
      throw new Error('Invalid token format');
    }

    const expected = Buffer.from(this.sign(`${header}.${payload}`, secret));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      throw new Error('Invalid token signature');
    }

    const claims = decode<SignedTokenClaims>(payload);
    if (
      claims.type !== expectedType ||
      typeof claims.jti !== 'string' ||
      typeof claims.sub !== 'string' ||
      typeof claims.tenantId !== 'string' ||
      !Array.isArray(claims.siteIds) ||
      !Array.isArray(claims.permissions) ||
      !Number.isInteger(claims.iat) ||
      !Number.isInteger(claims.exp)
    ) {
      throw new Error('Invalid token type');
    }
    if (claims.exp <= now) {
      throw new Error('Token expired');
    }
    return claims;
  }

  private sign(value: string, secret: string): string {
    return createHmac('sha256', secret).update(value).digest('base64url');
  }
}
