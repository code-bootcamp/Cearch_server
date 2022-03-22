import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateLectureProductInput {
  @Field(() => String, { nullable: true })
  classTitle!: string;

  @Field(() => String, { nullable: true })
  classDescription!: string;

  @Field(() => Int, { nullable: true })
  classRunTime!: number;

  @Field(() => Int, { nullable: true })
  classPrice!: number;

  @Field(() => Int, { nullable: true })
  classMaxUser!: number;
}
