import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinLectureAndProductCategory } from '../lectureproductCategory/entities/lectureproductCagtegoryclassCategory.entity';
import { MentoInfo } from '../user/entities/mento.entity';
import { LectureProductCategory } from '../lectureproductCategory/entities/lectureproductCategory.entity';
import { LectureProductCategoryResolver } from '../lectureproductCategory/lectureproductCategory.resolver';
import { LectureProductCategoryService } from '../lectureproductCategory/lectureproductCategory.service';
import { LectureRegistration } from '../lectureRegistration/entitites/lectureRegistration.entity';
import { LectureRegistrationService } from '../lectureRegistration/lectureRegistration.service';
import { User } from '../user/entities/user.entity';
import { LectureProduct } from './entities/lectureProduct.entity';
import { LectureProductResolver } from './lectureProduct.resolver';
import { LectureProductService } from './lectureProduct.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureProduct,
      LectureRegistration,
      User,
      LectureProductCategory,
      MentoInfo,
      JoinLectureAndProductCategory
    ]),
  ],
  providers: [
    LectureProductResolver,
    LectureProductService,
    LectureRegistrationService,
    LectureProductCategoryService,
    LectureProductCategoryResolver,
  ],
})
export class LectureProductModule {}
