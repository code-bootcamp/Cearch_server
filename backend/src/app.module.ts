import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { LectureProductModule } from './lectureProduct/lectureProduct.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LectureProductCategoryModule } from './lectureproductCategory/lectureproductCategory.module';
import { LectureReviewModule } from './lectureReview/lectureReview.module';

@Module({
  imports: [
    LectureProductModule,
    LectureReviewModule,
    LectureProductCategoryModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1111',
      database: 'mangosix',
      entities: [__dirname + '/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
