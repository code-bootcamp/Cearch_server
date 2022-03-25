import { Field, ObjectType } from '@nestjs/graphql';
import { LectureOrder } from 'src/apis/lectureOrder/entities/lectureOrder.entity';
import { LectureProduct } from 'src/apis/lectureProduct/entities/lectureProduct.entity';
import { User } from 'src/apis/user/entities/user.entity';
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
    (lecproduct) => lecproduct.registration,
  )
  @Field(() => LectureProduct)
  lecproduct: LectureProduct;

  @OneToMany(
    () => LectureOrder,
    (registration) => registration.order,
  )
  @Field(() => LectureOrder)
  registration: LectureOrder;

  @ManyToOne(() => User, (user) => user.registration)
  @Field(() => User)
  user: User

}
