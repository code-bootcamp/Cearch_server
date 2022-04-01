import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { USER_ROLE } from 'src/apis/user/entities/user.entity';
@Injectable()
export class JwtGooglestrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: `237557568181-nfsv7jfi69gkhspo3q0clor066h4pm0l.apps.googleusercontent.com`,
      clientSecret: `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`,
      callbackURL: `http://localhost:3000/login/google/callback`,
      //   clientID: process.env.GOOGLE_CLIENT_ID,
      //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //   callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }
  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(profile);
    return {
      name: profile.displayName,
      email: profile.emails[0].value,
      password: profile.id,
      role: USER_ROLE.MENTEE,
      gender: '성별없음',
      phoneNumber: '01000000000',
    };
  }
}
