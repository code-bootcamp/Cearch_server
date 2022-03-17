import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureReview } from './entities/lectureReview.entity';
import { LectureReviewResolver } from './lectureReview.resolver';
import { LectureReviewService } from './lectureReview.service';

@Module({
  imports: [TypeOrmModule.forFeature([LectureReview])],
  providers: [LectureReviewResolver, LectureReviewService],
})
export class LectureReviewModule {}
