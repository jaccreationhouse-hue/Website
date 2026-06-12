import { UnauthorizedException } from '@nestjs/common';
import { createHash, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import type { DatabaseService } from '../database/database.service.js';
import type { TokenClaims, TokenService } from './token.service.js';

interface UserDocument {
  id: string;
  email: string;
  passwordHash: string;
  status: string;
}

interface MembershipDocument {
  tenantId: string;
  userId: string;
  roleId: string;
  siteIds: string[];
  status: string;
}

interface RoleDocument {
  id: string;
  tenantId: string;
  permissions: string[];
  status?: string;
}

export class AuthService {
  private readonly database: DatabaseService;
  private readonly tokens: TokenService;

  constructor(database: DatabaseService, tokens: TokenService) {
    this.database = database;
    this.tokens = tokens;
  }

  async login(email: string, password: string) {
    const user = await this.database.collection<UserDocument & Record<string, unknown>>('users').findOne({
      email: email.trim().toLowerCase(),
      status: 'active'
    });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const membership = await this.database
      .collection<MembershipDocument & Record<string, unknown>>('memberships')
      .findOne({ userId: user.id, status: 'active' });
    if (!membership) throw new UnauthorizedException('Invalid credentials');
    const role = await this.database.collection<RoleDocument & Record<string, unknown>>('roles').findOne({
      id: membership.roleId,
      tenantId: membership.tenantId,
      status: { $ne: 'inactive' }
    });
    if (!role) throw new UnauthorizedException('Invalid credentials');

    return this.issue({
      sub: user.id,
      tenantId: membership.tenantId,
      siteIds: membership.siteIds,
      permissions: role.permissions
    });
  }

  async refresh(refreshToken: string) {
    const claims = this.verifyRefreshToken(refreshToken);
    const token = await this.database.collection('refreshTokens').findOneAndUpdate({
      tenantId: claims.tenantId,
      userId: claims.sub,
      tokenHash: hashToken(refreshToken),
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() }
    }, { $set: { revokedAt: new Date(), rotatedAt: new Date() } }, { returnDocument: 'before' });
    if (!token) throw new UnauthorizedException('Refresh token revoked');
    return this.issue(claims);
  }

  async logout(refreshToken: string): Promise<void> {
    const claims = this.verifyRefreshToken(refreshToken);
    await this.database.collection('refreshTokens').updateOne(
      {
        tenantId: claims.tenantId,
        userId: claims.sub,
        tokenHash: hashToken(refreshToken),
        revokedAt: { $exists: false }
      },
      { $set: { revokedAt: new Date() } }
    );
  }

  private async issue(claims: TokenClaims) {
    const accessToken = this.tokens.issueAccessToken(claims);
    const refreshToken = this.tokens.issueRefreshToken(claims);
    const refreshClaims = this.tokens.verifyRefreshToken(refreshToken);
    await this.database.collection('refreshTokens').insertOne({
      id: randomUUID(),
      tenantId: claims.tenantId,
      userId: claims.sub,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(refreshClaims.exp * 1_000),
      createdAt: new Date()
    });
    return { accessToken, refreshToken, expiresIn: this.tokens.accessExpiresInSeconds };
  }

  private verifyRefreshToken(refreshToken: string) {
    try {
      return this.tokens.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

export function hashPassword(password: string, salt: string): string {
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('base64url')}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [algorithm, salt, encoded] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !encoded) return false;
  try {
    const expected = Buffer.from(encoded, 'base64url');
    if (expected.length !== 64) return false;
    const actual = scryptSync(password, salt, expected.length);
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
