import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinLectureAndProductCategory } from '../lectureproductCategory/entities/lectureproductCagtegoryclassCategory.entity';
import { MentoInfo } from '../user/entities/mento.entity';
import { User } from '../user/entities/user.entity';
import { LectureProduct } from './entities/lectureProduct.entity';
import { LectureProductResolver } from './lectureProduct.resolver';
import { LectureProductService } from './lectureProduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([LectureProduct, User, MentoInfo])],
  providers: [
    LectureProductResolver,
    LectureProductService,
    JoinLectureAndProductCategory,
  ],
})
export class LectureProductModule {}
