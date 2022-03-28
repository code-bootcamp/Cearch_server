/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';
import { QtBoard } from 'src/apis/QtBoard/entities/qt.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinLectureAndProductCategory } from './lectureproductCagtegoryclassCategory.entity';

@Entity()
@ObjectType()
export class LectureProductCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  categoryname: string;

  // JoinLectureAndProductCategory와 1:N 연결
  @OneToMany(
    () => JoinLectureAndProductCategory,
    (category) => category.linkedToLectureProductCategory,
  )
  @Field(() => [JoinLectureAndProductCategory])
  category: JoinLectureAndProductCategory[];

  @ManyToOne(() => QtBoard, (qt) => qt.qtTags)
  @Field(() => QtBoard)
  qtBoard: QtBoard;
}
