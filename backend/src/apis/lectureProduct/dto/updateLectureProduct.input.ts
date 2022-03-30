import { Field, InputType, Int } from '@nestjs/graphql';
import { CLASS_CATEGORY } from '../entities/lectureProduct.entity';
@InputType()
export class UpdateLectureProductInput {
  @Field(() => String)
  classTitle!: string;

  @Field(() => CLASS_CATEGORY)
  classCategory!: CLASS_CATEGORY;

  @Field(() => String)
  classDescription: string;

  @Field(() => Int)
  classPrice: number;

  @Field(() => Int)
  classMaxUser: number;

  @Field(() => Int)
  classStartDate: number;
}
