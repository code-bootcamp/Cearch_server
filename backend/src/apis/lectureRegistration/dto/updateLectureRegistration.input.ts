import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateLectureRegistrationInput {
  @Field(() => Int)
  age: number

  @Field(() => String)
  phoneNumber: string

  @Field(() => String)
  selfIntroduction: string;

  @Field(() => String, {nullable: true})
  preQuestion: string;
}

