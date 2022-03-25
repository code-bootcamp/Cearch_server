import { Field, ObjectType } from '@nestjs/graphql';
import { LectureProductCategory } from 'src/apis/lectureproductCategory/entities/lectureproductCategory.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentoInfo } from './mento.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class JoinMentoAndProductCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // LectureProductCategory와 N:1 연결
  @ManyToOne(
    () => LectureProductCategory,
    (linkedToLectureProductCategory) => linkedToLectureProductCategory.category,
  )
  @Field(() => LectureProductCategory)
  linkedToLectureProductCategory: LectureProductCategory;

  // LectureProduct와 N:1 연결
  @ManyToOne(() => MentoInfo, (mento) => mento.work)
  @Field(() => MentoInfo)
  mento: User;
}
