import { Field, ObjectType } from '@nestjs/graphql';
import { LectureProductCategory } from 'src/apis/lectureproductCategory/entities/lectureproductCategory.entity';
import {
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class JoinUserAndProductCategory {
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
  @ManyToOne(() => User, (user) => user.interest)
  @Field(() => User)
  user: User;

  @DeleteDateColumn()
  deletedAt: Date;
}
