import { Field, InputType, PickType } from '@nestjs/graphql';
import { LectureProductCategory } from 'src/apis/lectureproductCategory/entities/lectureproductCategory.entity';
import { QtBoard } from '../entities/qt.entity';

@InputType()
export class MembersQtInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  contents!: string;

  @Field(() => [String])
  qtTags: string[];
}
