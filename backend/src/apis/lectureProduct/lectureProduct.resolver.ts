/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/common/auth/decorate/currentuser.decorate';
import { Role } from 'src/common/auth/decorate/role.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { RoleGuard } from 'src/common/auth/guard/roleGuard';
import { IcurrentUser } from '../auth/auth.resolver';
import { USER_ROLE } from '../user/entities/user.entity';
import { CreateLectureProductInput } from './dto/createLectureProduct.input';
import { UpdateLectureProductInput } from './dto/updateLectureProduct.input';
import { LectureProduct } from './entities/lectureProduct.entity';
import { LectureProductService } from './lectureProduct.service';

@Resolver()
export class LectureProductResolver {
  constructor(private readonly lectureProductService: LectureProductService) {}

  // Find Popular Classes
  @Query(() => [LectureProduct])
  async fetchPopularClass() {
    return await this.lectureProductService.findPopular();
  }

  // Create Class
  @Mutation(() => LectureProduct)
  @UseGuards(GqlAccessGuard)
  async createLectureProduct(
    @Args('createLectureProductInput')
    createLectureProductInput: CreateLectureProductInput,
    @CurrentUser() currentUser: IcurrentUser,
  ) {
    return await this.lectureProductService.create({
      user: currentUser,
      createLectureProductInput,
    });
  }
  // Find All Class : ReadAll
  @Query(() => [LectureProduct])
  async fetchlectureProducts() {
    return await this.lectureProductService.findAll();
  }
  // Find One Class : ReadOne
  @Query(() => LectureProduct)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTOR, USER_ROLE.MENTEE)
  async fetchLectureProduct(
    @Args('lectureproductId') lectureproductId: string, //
  ) {
    return await this.lectureProductService.findOne({ lectureproductId });
  }
  // Find NewClass : fetching new classes
  @Query(() => [LectureProduct])
  async fetchNewClasses() {
    return await this.lectureProductService.findNewClasses();
  }

  // Fetch Selected Tag Class
  @Query(() => [LectureProduct])
  async fetchSelectedTagLectures(
    @Args('lectureproductcategoryname') lectureproductcategoryname: string,
  ){
    return await this.lectureProductService.fetchSelectedTagLectures({
      lectureproduct: lectureproductcategoryname
    })
  }

  // FetchLectureWithMentor : 멘토가 본인이 개설한 수업 찾기
  @Query(() => [LectureProduct])
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTOR) // 테스트할땐 Mentee로
  async fetchLectureWithMentor(
    @CurrentUser() currentuser: IcurrentUser,
  ){
    return await this.lectureProductService.findLectureWithMentor({
      currentuser
    })
  }

  // FetchLectureWithMentee : 수강중인 수업 찾기
  @Query(() => [LectureProduct])
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE) // 테스트할땐 Mentee로
  async fetchLectureWithMentee(
    @CurrentUser() currentuser: IcurrentUser,
  ){
    return await this.lectureProductService.findLectureWithMentor({
      currentuser
    })
  }

  // Update Class
  @Mutation(() => LectureProduct)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTOR, USER_ROLE.MENTEE)
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
  @Mutation(() => Boolean)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTOR)
  async deleteLectureProduct(
    @Args('lectureproductId') lectureproductId: string,
  ) {
    return await this.lectureProductService.delete({ lectureproductId });
  }

  @Query(() => LectureProduct)
  async fetchLectureDetail(
    @Args('lectureId') lectureId: string, //
  ) {
    return await this.lectureProductService.fetchLectureDetail({ lectureId });
  }
}
