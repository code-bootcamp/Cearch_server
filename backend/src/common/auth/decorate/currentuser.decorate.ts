import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const user = GqlExecutionContext.create(ctx).getContext().user;
    console.log('User  :  ', user);
    return user;
  },
);
