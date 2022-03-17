import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from '../comments/entities/comments.entity';
import { QtBoard } from '../QtBoard/entities/QTboard.entity';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([QtBoard, Comments])],
  //   controllers: [AppController],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
