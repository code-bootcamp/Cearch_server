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
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchLecture } from './entities/searchLecture.entity';

@Resolver()
export class LectureProductResolver {
  constructor(
    private readonly lectureProductService: LectureProductService,
    private readonly elasticsearchService: ElasticsearchService,

  ) {}

  // Find Popular Classes
  @Query(() => [LectureProduct])
  async fetchPopularClass() {
    return await this.lectureProductService.findPopular();
  }

  @Query(() => [SearchLecture])
  async fetchLectureSearch(@Args('search') search: string) {
    const result = await this.elasticsearchService.search({
      index: 'lecture', // 테이블명
      query: {
        bool: {
          should: [
            { match: { classTitle: search } },
            { match: { classDescription: search } },
            { match: { name: search } },
          ],
        },
      },
    });
    console.log(result);
    const resultarray = result.hits.hits.map((ele: any) => ({
      id: ele._source.id,
      companyName: ele._source.companyName,
      department: ele._source.department,
      name: ele._source.name,
      selfIntro: ele._source.selfIntro,
      classTitle: ele._source.classTitle,
      classDescription: ele._source.classDescription,
      rating: ele._source.rating,
    }));
    console.log(resultarray);
    if (!resultarray) throw '검색결과가 없습니다.';
    return resultarray;
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
    // await this.elasticsearchService.create({
    //   id: 'myid1', //nosql
    //   index: 'lecture', // 테이블이나 컬렉션을 의미
    //   document: {
    //     ...createLectureProductInput,
    //   },
    // });
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
  // @UseGuards(GqlAccessGuard, RoleGuard)
  // @Role(USER_ROLE.MENTOR, USER_ROLE.MENTEE)
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
    @Args('lectureproductcategoryname') lectureproductcategoryname: string,
    @Args('page') page: number,
  ) {
    return await this.lectureProductService.fetchSelectedTagLectures({lectureproductcategoryname, page});
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
    // @Args('lectureproductcategoryId') lectureproductcategoryId: string
  ) {
    return await this.lectureProductService.delete({ lectureproductId});
  }

  @Query(() => LectureProduct)
  async fetchLectureDetail(
    @Args('lectureId') lectureId: string, //
  ) {
    return await this.lectureProductService.fetchLectureDetail({ lectureId });
  }
}
