import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModules } from './apis/auth/auth.module';
import { UserModules } from './apis/user/user.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModules,
    UserModules,
    GraphQLModule.forRoot({
      autoSchemaFile: '/src/grapqhql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
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
  providers: [AppService],
})
export class AppModule {}
