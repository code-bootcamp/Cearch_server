import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTable } from './entities/auth.entity';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from 'src/common/auth/strategy/refresh.strategy.jwt copy';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthTable, User]), //
    JwtModule.register({}),
  ],
  providers: [
    AuthResolver, //
    AuthService,
    JwtRefreshStrategy,
  ],
})
export class AuthModules {}
