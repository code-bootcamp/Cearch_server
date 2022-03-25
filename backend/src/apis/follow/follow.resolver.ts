import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/auth/decorate/currentuser.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { IcurrentUser } from '../auth/auth.resolver';
import { Follow } from './entities/follow.entity';
import { FollowService } from './follow.service';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => Follow)
  @UseGuards(GqlAccessGuard)
  async followToggle(
    @Args('mentoId') mentoId: string, //
    @CurrentUser() currentUser: IcurrentUser,
  ) {
    const result = await this.followService.followToggle({
      mentoId,
      user: currentUser,
    });
    return result;
  }
}
