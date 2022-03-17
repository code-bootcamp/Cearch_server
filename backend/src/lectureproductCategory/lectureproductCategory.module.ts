import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureProductCategory } from './entities/lectureproductCategory.entity';
import { LectureProductCategoryResolver } from './lectureproductCategory.resolver';
import { LectureProductCategoryService } from './lectureproductCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([LectureProductCategory])],
  providers: [
    LectureProductCategoryResolver, //
    LectureProductCategoryService,
  ],
})
export class LectureProductCategoryModule {}
