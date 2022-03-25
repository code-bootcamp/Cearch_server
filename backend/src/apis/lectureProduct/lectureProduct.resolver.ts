/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Role } from 'src/common/auth/decorate/role.decorate';
import { RoleGuard } from 'src/common/auth/guard/roleGuard';
import { USER_ROLE } from '../user/entities/user.entity';
import { CreateLectureProductInput } from './dto/createLectureProduct.input';
import { UpdateLectureProductInput } from './dto/updateLectureProduct.input';
import { LectureProduct } from './entities/lectureProduct.entity';
import { LectureProductService } from './lectureProduct.service';

@Resolver()
export class LectureProductResolver {
  constructor(private readonly lectureProductService: LectureProductService) {}

  //홈화면 인기있는 클래스 10개불러오기
  @Query(() => [LectureProduct])
  async fetchLectureRating() {
    return await this.lectureProductService.findPopular();
  }

  // Create Class
  // @UseGuards(RoleGuard)
  // @Role(USER_ROLE.MENTEE)
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
  // @UseGuards(RoleGuard)
  // @Role(USER_ROLE.MENTEE, USER_ROLE.MENTOR)
  @Query(() => [LectureProduct])
  async fetchlectureProducts(@Args('search') search: string) {
    return await this.lectureProductService.findAll();
  }
  // Find One Class : ReadOne
  // @UseGuards(RoleGuard)
  // @Role(USER_ROLE.MENTEE, USER_ROLE.MENTOR)
  @Query(() => LectureProduct)
  async fetchLectureProduct(
    @Args('lectureproductId') lectureproductId: string, //
  ) {
    return await this.lectureProductService.findOne({ lectureproductId });
  }
  // Find NewClass : fetching new classes
  // @UseGuards(RoleGuard)
  // @Role(USER_ROLE.MENTEE, USER_ROLE.MENTOR)
  @Query(() => LectureProduct)
  async fetchNewClasses() {
    return await this.lectureProductService.findNewClasses();
  }
  // Update Class
  // @UseGuards(RoleGuard)
  // @Role(USER_ROLE.MENTOR)
  @Mutation(() => LectureProduct)
  async updateLectureProduct(
    @Args('lectureproductId') lectureproductId: string,
    @Args('updateLectrueProductInput')
    updateLectureProductInput: UpdateLectureProductInput,
  ) {
    return await this.lectureProductService.update({
      lectureproductId,
      updateLectureProductInput,
    });
  }
  // Delete Class
  // @UseGuards(RoleGuard)
  // @Role(USER_ROLE.MENTOR)
  @Mutation(() => Boolean)
  async deleteLectureProduct(
    @Args('lectureproductId') lectureproductId: string,
  ) {
    return await this.lectureProductService.delete({ lectureproductId });
  }
}
