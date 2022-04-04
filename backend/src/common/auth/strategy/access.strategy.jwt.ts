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
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }
  async validate(req, payload) {
    console.log(req.headers.cookie);
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    try {
      const isAccess = await this.cacheManager.get(
        `accessToken:${accessToken}`,
      ); // refresh가 없는경우 access 와 상관없이 false
      console.log(isAccess);
      if (isAccess) {
        console.log('여기로 들어가면 안되는데');
        return false;
      }
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      throw new UnprocessableEntityException('REDIS cant get or push info');
    }
  }
}
