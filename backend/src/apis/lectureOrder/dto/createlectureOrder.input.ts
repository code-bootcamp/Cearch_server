import { Field, InputType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

@InputType()
export class CreateLectureOrderInput {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  registrationStatus!: string;
}
