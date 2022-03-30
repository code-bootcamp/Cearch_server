import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CurrentUser,
  ICurrentUser,
} from 'src/common/auth/decorate/currentuser.decorate';
import { Role } from 'src/common/auth/decorate/role.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { RoleGuard } from 'src/common/auth/guard/roleGuard';
import { USER_ROLE } from '../user/entities/user.entity';
import { LectureOrder } from './entities/lectureOrder.entity';
import { LectureOrderService } from './lectureOrder.service';

@Resolver()
export class LectureOrderResolver {
  constructor(private readonly lectureOrderService: LectureOrderService) {}

  // Placing Order
  @Mutation(() => LectureOrder)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE)
  async createlecturePayment(
    @Args('lectureRegistrationId') lectureRegistrationId: string,
    @CurrentUser() currentuser: ICurrentUser,
  ) {
    return await this.lectureOrderService.create({
      lectureRegistrationId,
      currentuser,
    });
  }

  // Fetch Order
  @Query(() => [LectureOrder])
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE)
  async fetchlectureOrders() {
    return await this.lectureOrderService.findAll();
  }

  // Fetch Orders
  @Query(() => LectureOrder)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE)
  async fetchlectureOrder(
    @Args('lectureorderId') lectureorderId: string,
    @Args('lectureRegistrationId') lectureRegistrationId: string,
    @CurrentUser() currentuser: ICurrentUser,
  ) {
    return await this.lectureOrderService.findOne({
      lectureorderId,
      lectureRegistrationId,
      currentuser,
    });
  }

  // Update Order
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE)
  @Mutation(() => LectureOrder)
  async updateLectureRegistration(
    @Args('lectureOrderId') lectureOrderId: string,
  ) {
    return await this.lectureOrderService.update({
      lectureOrderId,
    });
  }
  // Cancel Order
  @Mutation(() => Boolean)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE)
  async deleteLectureOrder(@Args('lectureorderId') lectureorderId: string) {
    return await this.lectureOrderService.delete({ lectureorderId });
  }
}
