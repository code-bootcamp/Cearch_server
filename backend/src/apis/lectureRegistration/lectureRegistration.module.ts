import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureRegistration } from './entitites/lectureRegistration.entity';
import { LectureRegistrationResolver } from './lectureRegistration.resolver';
import { LectureRegistrationService } from './lectureRegistration.service';

@Module({
  imports: [TypeOrmModule.forFeature([LectureRegistration])],
  providers: [LectureRegistrationResolver, LectureRegistrationService],
})
export class LectureRegistrationModule {}
