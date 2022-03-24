import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateLectureRegistrationInput {
  @Field(() => String)
  selfIntroduction: string;

  @Field(() => String)
  preQuestion: string;
}
