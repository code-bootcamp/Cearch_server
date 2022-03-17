import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true,
    });
  }
  async validate(req, payload) {
    try {
      const refreshToken = req.Headers.cookie.replace('refreshToken=', '');
      const isRefresh = this.cacheManager.get(`refresh:${refreshToken}`); // refresh가 없는경우 access 와 상관없이 false
      if (isRefresh) return false;
      return {
        id: payload.id,
        email: payload.sub,
        role: payload.role,
      };
    } catch (error) {
      throw new UnprocessableEntityException('cannot find at redis');
    }
  }
}
