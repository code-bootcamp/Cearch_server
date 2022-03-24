/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LectureImage } from 'src/apis/lectureImage/entities/lectureImage.entity';
import { JoinLectureAndProductCategory } from 'src/apis/lectureproductCategory/entities/lectureproductCagtegory.classCategory.entity';
import { LectureRegistration } from 'src/apis/lectureRegistration/entitites/lectureRegistration.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class LectureProduct {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  classTitle: string;

  @Column()
  @Field(() => String)
  classDescription: string;

  @Column()
  @Field(() => Int)
  classRunTime: number;

  @Column()
  @Field(() => Int)
  classPrice: number;

  @UpdateDateColumn()
  classDuedate: Date;

  @Column({ default: false })
  @Field(() => Boolean)
  isApplicable: boolean;

  @Column()
  @Field(() => Int)
  classMaxUser: number;

  @Column()
  @Field(() => Int)
  classAppliedUser: number;

  @Column({ default: false })
  @Field(() => Boolean)
  classOpen: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt?: Date;

  @OneToMany(() => LectureImage, (image) => image.product, {
    cascade: true,
  })
  @Field(() => [LectureImage])
  image: LectureImage[];

  // JoinLectureAndProductCategory와 1:N 연결
  @OneToMany(
    () => JoinLectureAndProductCategory,
    (lecproduct) => lecproduct.linkedToLectureProduct,
  )
  @Field(() => [JoinLectureAndProductCategory])
  lecproduct: JoinLectureAndProductCategory[];

  // LectureRegistration과 1:N 연결
  @OneToMany(
    () => LectureRegistration,
    (registration) => registration.linkedToLectureRegistration,
  )
  @Field(() => [LectureRegistration])
  registration: LectureRegistration[];
}
