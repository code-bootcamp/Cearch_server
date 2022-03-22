import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx).getContext().req;
    const user = context.user;
    return user;
  },
);
