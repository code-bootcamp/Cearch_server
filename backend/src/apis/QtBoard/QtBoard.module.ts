import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from '../comments/entities/comments.entity';
import { QtBoard } from './entities/QTboard.entity';
import { QtBoardResolver } from './QtBoard.resolver';
import { QtBoardService } from './QtBoard.service';
//각각의 모듈을 최종적으로 조립하는것 이것을 최종적으로 app.module로 가져가는것.
@Module({
  imports: [TypeOrmModule.forFeature([QtBoard, Comments])],
  //   controllers: [AppController],
  providers: [QtBoardResolver, QtBoardService],
})
export class QtBoardModule {}
