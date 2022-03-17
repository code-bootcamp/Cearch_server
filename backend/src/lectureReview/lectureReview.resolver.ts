import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateLectureReviewInput } from './dto/createLectureReview.input';
import { LectureReview } from './entities/lectureReview.entity';
import { LectureReviewService } from './lectureReview.service';

@Resolver()
export class LectureReviewResolver {
  constructor(private readonly lectureReviewService: LectureReviewService) {}

  // Create Review
  @Mutation(() => LectureReview)
  async createLectureReview(
    @Args('createLectureReviewInput')
    createLectureReviewInput: CreateLectureReviewInput,
  ) {
    // return await this.lectureReviewService.create({
    //   createLectureReviewInput,
    // });
  }
}
