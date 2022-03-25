import { Field, InputType, PickType } from '@nestjs/graphql';
import { QtBoard } from '../entities/qt.entity';

@InputType()
export class NonMembersQtInput extends PickType(
  QtBoard,
  ['title', 'contents'],
  InputType,
) {
  @Field(() => String)
  password: string;
}
