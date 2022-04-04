import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CurrentUser,
} from 'src/common/auth/decorate/currentuser.decorate';
import { IcurrentUser } from '../auth/auth.resolver';
import { Role } from 'src/common/auth/decorate/role.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { RoleGuard } from 'src/common/auth/guard/roleGuard';
import { USER_ROLE } from '../user/entities/user.entity';
import { CreateLectureRegistrationInput } from './dto/createLectureRegistration.input';
import { UpdateLectureRegistrationInput } from './dto/updateLectureRegistration.input';
import { LectureRegistration } from './entitites/lectureRegistration.entity';
import { LectureRegistrationService } from './lectureRegistration.service';

@Resolver()
export class LectureRegistrationResolver {
  constructor(
    private readonly lectureRegistrationService: LectureRegistrationService,
  ) {}

  // Create Registration
  @Mutation(() => LectureRegistration)
  @UseGuards(GqlAccessGuard)
  async createLectureRegistration(
    @Args('createLectureRegistrationInput')
    createLectureRegistrationInput: CreateLectureRegistrationInput,
    @Args('lectureproductId')
    productId: string,
    @CurrentUser() currentuser: IcurrentUser,
  ) {
    return await this.lectureRegistrationService.create({
      user: currentuser,
      productId,
      createLectureRegistrationInput,
    });
  }

  // FindAll Registration
  @Query(() => [LectureRegistration])
  @UseGuards(GqlAccessGuard, RoleGuard)
  async fetchlectureRegistrations(
    @CurrentUser() currentuser: IcurrentUser,
    @Args('search') search: string,
  ) {
    return await this.lectureRegistrationService.findAll();
  }

  // FindOne Registration
  @Query(() => LectureRegistration)
  @UseGuards(GqlAccessGuard, RoleGuard)
  async fetchlectureRegistration(
    @Args('lectureRegistrationId') lectureRegistrationId: string,
  ) {
    return await this.lectureRegistrationService.findOne({
      lectureRegistrationId,
    });
  }

  // Update Registration
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE)
  @Mutation(() => LectureRegistration)
  async updateLectureRegistration(
    @Args('lectureregistrationId') lectureRegistrationId: string,
    @Args('updateLectrueProductInput')
    updatelectureRegistrationInput: UpdateLectureRegistrationInput,
  ) {
    return await this.lectureRegistrationService.update({
      lectureRegistrationId,
      updatelectureRegistrationInput,
    });
  }
  // Delete Registration
  @Mutation(() => Boolean)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE)
  async deleteLectureRegistration(
    @Args('lectureRegistrationId') lectureRegistrationId: string,
  ) {
    return await this.lectureRegistrationService.delete({
      lectureRegistrationId,
    });
  }
}
