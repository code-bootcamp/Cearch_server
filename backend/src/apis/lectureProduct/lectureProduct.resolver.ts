import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, ID } from '@nestjs/graphql';
import {
  CurrentUser,
} from 'src/common/auth/decorate/currentuser.decorate';
import { Role } from 'src/common/auth/decorate/role.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { RoleGuard } from 'src/common/auth/guard/roleGuard';
import { IcurrentUser } from '../auth/auth.resolver';
import { JoinLectureAndProductCategory } from '../lectureproductCategory/entities/lectureproductCagtegoryclassCategory.entity';
import { USER_ROLE } from '../user/entities/user.entity';
import { CreateLectureProductInput } from './dto/createLectureProduct.input';
import { LectureProduct } from './entities/lectureProduct.entity';
import { LectureProductService } from './lectureProduct.service';

@Resolver()
export class LectureProductResolver {
  constructor(
    private readonly lectureProductService: LectureProductService
  ) {}

  // Find Popular Classes
  @Query(() => [LectureProduct])
  async fetchPopularClass() {
    return await this.lectureProductService.findPopular();
  }

  // Create Class
  @Mutation(() => LectureProduct)
  @UseGuards(GqlAccessGuard)
  @Role(USER_ROLE.MENTOR)
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
  async fetchlectureProducts(
    @Args('page') page: number,
  ) {
    return await this.lectureProductService.findAll();
  }

  // Find One Class : ReadOne
  @Query(() => LectureProduct)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTOR, USER_ROLE.MENTEE)
  async fetchLectureProduct(
    @Args('lectureproductId') lectureproductId: string, //
    @Args('page') page: number,
  ) {
    return await this.lectureProductService.findOne({ lectureproductId, page });
  }
  // Find NewClass : fetching new classes
  @Query(() => [LectureProduct])
  async fetchNewClasses() {
    return await this.lectureProductService.findNewClasses();
  }

  // Fetch Selected Tag Class
  @Query(() => [LectureProduct])
  async fetchSelectedTagLectures(
    @Args('lectureproductcategoryId') lectureproductcategoryId: string,
    @Args('page') page: number,
  ) {
    return await this.lectureProductService.fetchSelectedTagLectures({lectureproductcategoryId, page});
  }

  // FetchLectureWithMentor : 멘토가 본인이 개설한 수업 찾기
  @Query(() => [LectureProduct])
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTOR) // 테스트할땐 Mentee로
  async fetchLectureWithMentor(@CurrentUser() currentuser: IcurrentUser) {
    return await this.lectureProductService.findLectureWithMentor({
      currentuser,
    });
  }

  // FetchLectureWithMentee : 수강중인 수업 찾기
  @Query(() => [LectureProduct])
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTEE) // 테스트할땐 Mentee로
  async fetchLectureWithMentee(@CurrentUser() currentuser: IcurrentUser) {
    return await this.lectureProductService.findLectureWithMentor({
      currentuser,
    });
  }

  // Update Class
  @Mutation(() => LectureProduct)
  @UseGuards(GqlAccessGuard, RoleGuard)
  @Role(USER_ROLE.MENTOR, USER_ROLE.MENTEE)
  async updateLectureProduct(
    @Args('lectureproductId') lectureproductId: string,
  ) {
    return await this.lectureProductService.update({
      lectureproductId,
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
