import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AppService } from './app.service';
import { CommentsModule } from './apis/comments/comments.module';
import { LectureProductModule } from './apis/lectureProduct/lectureProduct.module';
import { QtBoardModule } from './apis/QtBoard/QtBoard.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JwtAccessStrategy } from './common/auth/strategy/access.strategy.jwt';
import { JwtRefreshStrategy } from './common/auth/strategy/refresh.strategy.jwt';
import { LectureProductCategoryModule } from './apis/lectureproductCategory/lectureproductCategory.module';
import { LectureOrderModule } from './apis/lectureOrder/lectureOrder.module';
import { LectureRegistrationModule } from './apis/lectureRegistration/lectureRegistration.module';
import { LikesModule } from './apis/likes/likes.module';
import { PointModule } from './apis/point/point.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from './apis/file/file.module';
import { FollowModule } from './apis/follow/follow.module';

@Module({
  imports: [
    LikesModule,
    AuthModule,
    UserModule,
    QtBoardModule,
    CommentsModule,
    PointModule,
    LectureProductModule,
    LectureProductCategoryModule,
    LectureRegistrationModule,
    LectureOrderModule,
    FileUploadModule,
    FollowModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: '/src/grapqhql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my_db',
      database: 'test_db',
      username: 'root',
      password: '0000',
      entities: [__dirname + '/apis/**/*.entity.*'],
      logging: true,
      synchronize: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my_redis:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}
