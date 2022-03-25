import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureProduct } from '../lectureProduct/entities/lectureProduct.entity';
import { LectureProductService } from '../lectureProduct/lectureProduct.service';
import { MentoInfo } from '../user/entities/mento.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LectureRegistration } from './entitites/lectureRegistration.entity';
import { LectureRegistrationResolver } from './lectureRegistration.resolver';
import { LectureRegistrationService } from './lectureRegistration.service';

@Module({
  imports: [TypeOrmModule.forFeature([LectureRegistration,User,LectureProduct,MentoInfo])],
  providers: [LectureRegistrationResolver, LectureRegistrationService, LectureProductService, UserService],
})
export class LectureRegistrationModule {}
