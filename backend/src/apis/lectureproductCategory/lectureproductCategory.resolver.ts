import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LectureProductCategory } from './entities/lectureproductCategory.entity';
import { LectureProductCategoryService } from './lectureproductCategory.service';

@Resolver()
export class LectureProductCategoryResolver {
  constructor(
    private readonly lectureproductCategoryService: LectureProductCategoryService,
  ) {}

  @Mutation(() => LectureProductCategory)
  async createProductCategory(@Args('tagname') tagname: string) {
    return await this.lectureproductCategoryService.create({ tagname });
  }

  @Mutation(() => Boolean)
  async deleteProductCategory(
    @Args('productCategoryId') lectureproductCategoryId: string,
  ) {
    return await this.lectureproductCategoryService.delete({
      lectureproductCategoryId,
    });
  }
}
