import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { LectureImage } from 'src/apis/LectureImage/entities/lectureImage.entity';
import { JoinLectureAndProductCategory } from 'src/apis/lectureproductCategory/entities/lectureproductCagtegoryclassCategory.entity';
import { LectureRegistration } from 'src/apis/lectureRegistration/entitites/lectureRegistration.entity';
import { LectureReview } from 'src/apis/lectureReview/entities/lectureReview.entity';
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
  @Field(() => String, {nullable:true})
  classTitle: string;

  @Column()
  @Field(() => String, {nullable:true})
  classDescription: string;

  @Column()
  @Field(() => Int, {nullable:true})
  classRunTime: number;

  @Column()
  @Field(() => Int, {nullable:true})
  classPrice: number;

  @UpdateDateColumn()
  classDuedate: Date;

  @Column({ default: false })
  @Field(() => Boolean, {nullable:true})
  isApplicable: boolean;

  @Column()
  @Field(() => Int, {nullable:true})
  classMaxUser: number;

  @Column()
  @Field(() => Int, {nullable:true})
  classAppliedUser: number;

  @Column({ default: false })
  @Field(() => Boolean, {nullable:true})
  classOpen: boolean;

  @Column({ default: 0, type: 'float' })
  @Field(() => Float, {nullable:true})
  rating: number;
  
  @Column()
  @Field(() => String)
  classCategory: string

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt?: Date;

  @OneToMany(() => LectureImage, (image) => image.lecproduct, {
    cascade: true,
  })
  @Field(() => [LectureImage])
  image: LectureImage[];

  @OneToMany(() => LectureReview, (review) => review.user, {
    cascade: true,
  })
  @Field(() => [LectureReview])
  reviews: LectureReview[];

  @OneToMany(
    () => JoinLectureAndProductCategory,
    (lecproduct) => lecproduct.linkedToLectureProduct,
  )
  @Field(() => [JoinLectureAndProductCategory])
  lecproduct: JoinLectureAndProductCategory[];

  // LectureRegistration과 1:N 연결
  @OneToMany(
    () => LectureRegistration,
    (registration) => registration.lecproduct,
  )
  @Field(() => [LectureRegistration])
  registration: LectureRegistration[];
}
