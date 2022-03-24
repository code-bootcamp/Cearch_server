import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthTable } from '../auth/entities/auth.entity';
import { MentoInfo } from './entities/mento.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthTable, MentoInfo]),
    JwtModule.register({}),
  ],
  providers: [
    UserService, //
    UserResolver,
    AuthService,
  ],
  exports: [AuthService],
})
export class UserModule {}
