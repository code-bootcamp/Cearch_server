import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLectureProductCategoryInput {
  @Field(() => String)
  categoryname: string;
}
