import { InputType, PickType } from '@nestjs/graphql';

import { User } from '../entities/user.entity';

@InputType()
export class UserInput extends PickType(
  User,
  ['email', 'name', 'phoneNumber', 'password', 'gender'],
  InputType,
) {}
