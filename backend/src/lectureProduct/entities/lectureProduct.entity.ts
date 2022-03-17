import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LectureProductCategory } from 'src/lectureproductCategory/entities/lectureproductCategory.entity';
import { LectureReview } from 'src/lectureReview/entities/lectureReview.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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
  classResgisrationDate: Date;

  @UpdateDateColumn()
  classDuedate: Date;

  @Column({ default: false })
  @Field(() => Boolean)
  isApplicable: Boolean;

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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => LectureProductCategory, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  //
  @ManyToOne(() => LectureReview, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  //
  @Field(() => LectureProductCategory, { nullable: true })
  lectureproductCategory?: LectureProductCategory;
}
