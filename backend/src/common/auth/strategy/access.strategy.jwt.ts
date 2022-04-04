import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

ExtractJwt.fromAuthHeaderAsBearerToken;
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_KEY_TOKEN,
      passReqToCallback: true,
    });
  }
  async validate(req, payload) {
    console.log(req.headers.cookie);
    const refreshToken = req.headers.cookie.replace('refreshToken=', '');
    console.log('strategy refresh : ', refreshToken);
    try {
      const isRefresh = await this.cacheManager.get(`refresh:${refreshToken}`); // refresh가 없는경우 access 와 상관없이 false
      console.log(isRefresh);
      if (isRefresh) {
        return false;
      }
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        exp: payload.exp,
      };
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('REDIS cant get or push info');
    }
  }
}
