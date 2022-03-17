import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateQtBoardInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  contents!: string;

  @Field(() => Int, { nullable: true })
  point: number;

  @Field(() => Int, { nullable: true })
  likescount: number;
}
