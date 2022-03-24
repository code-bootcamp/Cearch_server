import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLectureRegistrationInput {
  @Field(() => String)
  selfIntroduction: string;

  @Field(() => String)
  preQuestion: string;
}
