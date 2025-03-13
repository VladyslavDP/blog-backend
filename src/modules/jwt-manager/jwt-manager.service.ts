import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtHeader, JwtPayload } from 'jwt-decode';
import { JsonObject } from 'aws-jwt-verify/safe-json-parse';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UUID } from '@app/common/types/common';

const KEY_USER_PREFIX = 'blacklist-user';

const TTL_ONE_WEEK = 60 * 60 * 24 * 7;

@Injectable()
export class JwtManagerService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) {}

  async jwtUserChecker(props: {
    header: JwtHeader;
    payload: JwtPayload;
    jwk: JsonObject;
  }): Promise<void> {
    const { payload } = props;
    const { sub, iat, iss } = payload;

    const userPoolId = process.env.COGNITO_USER_POOL_ID;

    if (!iss.endsWith(userPoolId)) {
      throw new UnauthorizedException('You are not authorized');
    }

    const invalidateTime = await this.cacheService.get(
      `${KEY_USER_PREFIX}:${sub}`,
    );

    if (invalidateTime) {
      if (iat < Number(invalidateTime)) {
        throw new UnauthorizedException('Error');
      }
    }
  }

  async addUserTokenToBlacklist(accessToken: string): Promise<void> {
    const { sub } = this.parseToken(accessToken);
    await this.cacheService.set(
      `${KEY_USER_PREFIX}:${sub}`,
      (Date.now() / 1000) | 0,
      TTL_ONE_WEEK,
    );
  }

  async addUserTokenToBlacklistByUserId(userId: UUID): Promise<void> {
    await this.cacheService.set(
      `${KEY_USER_PREFIX}:${userId}`,
      (Date.now() / 1000) | 0,
      TTL_ONE_WEEK,
    );
  }

  async removeUserTokenToBlacklistByUserId(userId: UUID): Promise<void> {
    await this.cacheService.del(`${KEY_USER_PREFIX}:${userId}`);
  }

  private parseToken(token: string): JwtPayload {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }
}
