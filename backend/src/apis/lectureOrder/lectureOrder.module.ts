import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureOrder } from './entities/lectureOrder.entity';
import { LectureOrderResolver } from './lectureOrder.resolver';
import { LectureOrderService } from './lectureOrder.service';

@Module({
  imports: [TypeOrmModule.forFeature([LectureOrder])],
  providers: [LectureOrderResolver, LectureOrderService],
})
export class LectureOrderModule {}
