import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateLectureProductInput } from './dto/createLectureProduct.input';
import { UpdateLectureProductInput } from './dto/updateLectureProduct.input';
import { LectureProduct } from './entities/lectureProduct.entity';
import { LectureProductService } from './lectureProduct.service';

@Resolver()
export class LectureProductResolver {
  constructor(private readonly lectureProductService: LectureProductService) {}

  // Create Class
  @Mutation(() => LectureProduct)
  async createLectureProduct(
    @Args('createLectureProductInput')
    createLectureProductInput: CreateLectureProductInput,
  ) {
    return await this.lectureProductService.create({
      createLectureProductInput,
    });
  }
  // Find All Class : ReadAll
  @Query(() => [LectureProduct])
  async lectureProducts(
    @Args('search') search: string, //
  ) {
    return await this.lectureProductService.findAll();
  }
  // Find One Class : ReadOne
  @Query(() => LectureProduct)
  async fetchLectureProduct(
    @Args('lectureproductId') lectureproductId: string, //
  ) {
    return await this.lectureProductService.findOne({ lectureproductId });
  }
  // Update Class
  @Mutation(() => LectureProduct)
  async updateLectureProduct(
    @Args('lectureproductId') lectureproductId: string, //
    @Args('updateLectrueProductInput')
    updateLectureProductInput: UpdateLectureProductInput, //
  ) {
    return await this.lectureProductService.update({
      lectureproductId,
      updateLectureProductInput,
    });
  }
  // Delete Class
  @Mutation(() => LectureProduct)
  async deleteLectureProduct(
    @Args('lectureproductId') lectureproductId: string,
  ) {
    return await this.lectureProductService.delete({ lectureproductId });
  }
}
