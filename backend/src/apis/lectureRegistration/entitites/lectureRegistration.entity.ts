import { Field, ObjectType } from '@nestjs/graphql';
import { LectureOrder } from 'src/apis/lectureOrder/entities/lectureOrder.entity';
import { LectureProduct } from 'src/apis/lectureProduct/entities/lectureProduct.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class LectureRegistration {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  selfIntroduction: string;

  @Column()
  @Field(() => String)
  preQuestion: string;

  @ManyToOne(
    () => LectureProduct,
    (linkedToLectureRegistration) => linkedToLectureRegistration.registration,
  )
  @Field(() => LectureProduct)
  linkedToLectureRegistration: LectureProduct;

  @OneToMany(
    () => LectureOrder,
    (linkedToLectureOrder) => linkedToLectureOrder.order,
  )
  @Field(() => LectureOrder)
  linkedToLectureOrder: LectureOrder;
}
