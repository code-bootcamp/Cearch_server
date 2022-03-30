import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthTable } from '../auth/entities/auth.entity';
import { LectureProductCategory } from '../lectureproductCategory/entities/lectureproductCategory.entity';
import { MentoInfo } from './entities/mento.entity';
import { User } from './entities/user.entity';
import { JoinMentoAndProductCategory } from './entities/workMento.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AuthTable,
      MentoInfo,
      JoinMentoAndProductCategory,
      LectureProductCategory,
    ]),
    JwtModule.register({}),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    UserService, //
    UserResolver,
    AuthService,
  ],
  exports: [AuthService],
})
export class UserModule {}
