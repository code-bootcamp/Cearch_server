import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthTable } from '../auth/entities/auth.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthTable]),
    JwtModule.register({}),
  ],
  providers: [
    UserService, //
    UserResolver,
    AuthService,
  ],
  exports: [AuthService],
})
export class UserModules {}
