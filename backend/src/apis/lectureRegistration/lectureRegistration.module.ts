import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureProduct } from '../lectureProduct/entities/lectureProduct.entity';
import { LectureProductResolver } from '../lectureProduct/lectureProduct.resolver';
import { LectureProductService } from '../lectureProduct/lectureProduct.service';
import { LectureProductCategory } from '../lectureproductCategory/entities/lectureproductCategory.entity';
import { LectureProductCategoryResolver } from '../lectureproductCategory/lectureproductCategory.resolver';
import { LectureProductCategoryService } from '../lectureproductCategory/lectureproductCategory.service';
import { MentoInfo } from '../user/entities/mento.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LectureRegistration } from './entitites/lectureRegistration.entity';
import { LectureRegistrationResolver } from './lectureRegistration.resolver';
import { LectureRegistrationService } from './lectureRegistration.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    LectureRegistration,
    User,
    LectureProduct,
    MentoInfo,
    LectureProductCategory
  ])],
  providers: [
    LectureRegistrationResolver, 
    LectureRegistrationService,
    LectureProductResolver,
    LectureProductService,
    UserService,
    LectureProductCategoryResolver,
    LectureProductCategoryService
  ],
})
export class LectureRegistrationModule {}

