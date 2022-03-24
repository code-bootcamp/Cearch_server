import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateLectureRegistrationInput } from './dto/createLectureRegistration.input';
import { LectureRegistration } from './entitites/lectureRegistration.entity';
import { LectureRegistrationService } from './lectureRegistration.service';

@Resolver()
export class LectureRegistrationResolver {
  constructor(
    private readonly lectureRegistrationService: LectureRegistrationService,
  ) {}

  @Mutation(() => LectureRegistration)
  async createLectureRegistration(
    @Args('createLectureRegistrationInput')
    createLectureRegistrationInput: CreateLectureRegistrationInput,
  ) {
    return await this.lectureRegistrationService.create({
      createLectureRegistrationInput,
    });
  }

  @Query(() => [LectureRegistration])
  async fetchlectureRegistrations(@Args('search') search: string) {
    return await this.lectureRegistrationService.findAll();
  }

  @Query(() => LectureRegistration)
  async fetchlectureRegistration(
    @Args('lectureRegistrationId') lectureRegistrationId: string,
  ) {
    return await this.lectureRegistrationService.findOne({
      lectureRegistrationId,
    });
  }

  @Mutation(() => Boolean)
  async deleteLectureRegistration(
    @Args('lectureRegistrationId') lectureRegistrationId: string,
  ) {
    return await this.lectureRegistrationService.delete({
      lectureRegistrationId,
    });
  }
}
