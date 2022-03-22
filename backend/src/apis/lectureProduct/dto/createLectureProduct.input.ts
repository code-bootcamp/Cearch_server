import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateLectureProductInput {
  @Field(() => String)
  classTitle!: string;

  @Field(() => String)
  classDescription!: string;

  @Field(() => Int)
  classRunTime!: number;

  @Field(() => Int)
  classPrice!: number;

  @Field(() => Int)
  classMaxUser!: number;

  @Field(() => Int, { nullable: true })
  classAppliedUser: number;
}
