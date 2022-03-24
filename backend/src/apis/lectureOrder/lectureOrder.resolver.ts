import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateLectureOrderInput } from './dto/createlectureOrder.input';
import { LectureOrder } from './entities/lectureOrder.entity';
import { LectureOrderService } from './lectureOrder.service';

@Resolver()
export class LectureOrderResolver {
  constructor(private readonly lectureOrderService: LectureOrderService) {}

  // Placing Order
  @Mutation(() => LectureOrder)
  async createLectureOrder(
    @Args('createLectureOrderInput')
    createLectureOrderInput: CreateLectureOrderInput,
  ) {
    return await this.lectureOrderService.create({
      createLectureOrderInput,
    });
  }

  @Query(() => [LectureOrder])
  async fetchlectureOrders(@Args('search') search: string) {
    return await this.lectureOrderService.findAll();
  }

  @Query(() => LectureOrder)
  async fetchlectureOrder(@Args('lectureorderId') lectureorderId: string) {
    return await this.lectureOrderService.findOne({ lectureorderId });
  }
  // Cancel Order
  @Mutation(() => Boolean)
  async deleteLectureOrder(@Args('lectureorderId') lectureorderId: string) {
    return await this.lectureOrderService.delete({ lectureorderId });
  }
}
