import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class LectureReview {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Float)
  starRating: number;

  @CreateDateColumn()
  reviewCreatedAt: Date;

  @Column()
  @Field(() => String)
  reviewContents: string;

  @Column()
  @Field(() => Int)
  likes: number;
}
