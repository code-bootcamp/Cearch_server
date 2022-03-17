import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QtBoardModule } from './apis/QtBoard/QtBoard.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CommentsModule } from './apis/comments/comments.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    QtBoardModule,
    CommentsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      // context: ({ req, res }) => ({ req, res }),
    }), //
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '852741',
      database: 'cearch',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
