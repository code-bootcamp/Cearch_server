import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureProduct } from './entities/lectureProduct.entity';
import { LectureProductResolver } from './lectureProduct.resolver';
import { LectureProductService } from './lectureProduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([LectureProduct])],
  providers: [LectureProductResolver, LectureProductService],
})
export class LectureProductModule {}
