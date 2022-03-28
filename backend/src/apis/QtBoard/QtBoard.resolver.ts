import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CurrentUser,
  ICurrentUser,
} from 'src/common/auth/decorate/currentuser.decorate';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { NonMembersQtInput } from './dto/nonMembersQt';
import { MembersQtInput } from './dto/membersQtBoard.input';
import { QtBoard } from './entities/qt.entity';
import { Cache } from 'cache-manager';
import { QtBoardService } from './QtBoard.service';
import { Role } from 'src/common/auth/decorate/role.decorate';
import { USER_ROLE } from '../user/entities/user.entity';
import { Notice } from './entities/notice.entity';

@Resolver()
export class QtBoardResolver {
  constructor(
    private readonly qtBoardService: QtBoardService,
    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => [QtBoard]) // Query graphql에서 임포트 되는지 잘 보자
  async fetchProducts(@Args('search') search: string) {
    //1. Redis에 캐시되어 있는 지  확인하기
    // const searchCache = await this.cacheManager.get(`qtBoard:${search}`);
    //2. Redis에 캐시되어 있지 않다면, 엘라스틱 서치에서 조회하기 (유저가 검색한 검색어로 조회하기)
    // if (searchCache) return searchCache;
    // else {
    const result = await this.elasticsearchService.search({
      index: 'qtboard', // 테이블명
      query: {
        bool: {
          should: [
            { match: { title: search } },
            { match: { contents: search } },
          ],
        },
      },
    });
    // console.log(JSON.stringify(result, null, ' '));
    const resultarray = result.hits.hits.map((ele: any) => ({
      id: ele._source.id,
      title: ele._source.title,
      contents: ele._source.contents,
      name: ele._source.name,
    }));
    // console.log(resultarray)
    //3. 엘라스틱 서치에서 조회 결과가 있다면, Redis에 검색결과 캐싱해놓기
    // await this.cacheManager.set(`qtBoard:${search}`, resultarray, {
    //   ttl: 0,
    // });
    // await this.productService.findAll();
    // 4. 최종결과 브라우저에 리턴해주기
    return resultarray;
    // }

    // await this.productService.findAll();
  }

  //총 게시글 수
  @Query(() => Int)
  async fetchAllPostCount() {
    return await this.qtBoardService.findCount();
  }

  //게시글 10개 가져오기
  @Query(() => [QtBoard])
  async fetchQtBoards(@Args('page') page: number) {
    return await this.qtBoardService.findAll({ page });
  }

  //좋아요 순서대로 게시글 10개 가져오기
  @Query(() => [QtBoard])
  async fetchLikePost() {
    return await this.qtBoardService.findLikePost();
  }

  //게시글 1개 가져오기
  @Query(() => QtBoard)
  async fetchQtBoard(@Args('postId') postId: string) {
    return await this.qtBoardService.findOne({ postId });
  }

  @Query(() => [Notice])
  async fetchNotices() {
    return await this.qtBoardService.findNoticeAll();
  }

  @Query(() => Notice)
  async fetchNotice(@Args('postId') postId: string) {
    return await this.qtBoardService.findNotice({ postId });
  }

  //공지사항 생성하기
  @UseGuards(GqlAccessGuard)
  @Role(USER_ROLE.ADMIN)
  @Mutation(() => Notice)
  async createNotice(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('title') title: string,
    @Args('contents') contents: string,
  ) {
    return await this.qtBoardService.createNotice({
      currentUser,
      title,
      contents,
    });
  }

  //내가 쓴 질문들 보기
  @UseGuards(GqlAccessGuard)
  @Query(() => [QtBoard])
  async fetchMyQt(
    @CurrentUser() currentuser: ICurrentUser,
    @Args('page') page: number,
  ) {
    return await this.qtBoardService.findMyQt({ currentuser, page });
  }

  // 게시글 생성
  @UseGuards(GqlAccessGuard)
  @Mutation(() => QtBoard)
  async createQtBoard(
    @CurrentUser() currentuser: ICurrentUser,
    @Args('memberQtInput') memberQtInput: MembersQtInput,
  ) {
    return await this.qtBoardService.create({
      currentuser,
      memberQtInput,
    });
  }

  // 비회원 게시글 생성
  @Mutation(() => QtBoard)
  async createNonMembersQtBoard(
    @Args('nonMembersQtInput') nonMembersQtInput: NonMembersQtInput,
  ) {
    // 엘라스틱 서치 등록하기 연습 => 실제로는 MySQL에 저장할 예정!
    await this.elasticsearchService.create({
      id: 'myid1', //nosql
      index: 'qtboard', // 테이블이나 컬렉션을 의미
      document: {
        ...nonMembersQtInput,
      },
    });

    return await this.qtBoardService.nonMemberCreate({
      nonMembersQtInput,
    });
  }

  //비회원 게시글 수정
  @Mutation(() => QtBoard)
  async updateNonMembersQtBoard(
    @Args('postId') postId: string,
    @Args('nonMembersQtInput') nonMembersQtInput: NonMembersQtInput,
  ) {
    return await this.qtBoardService.nonMembersUpdate({
      postId,
      nonMembersQtInput,
    });
  }

  //회원 게시글 수정
  @UseGuards(GqlAccessGuard)
  @Mutation(() => QtBoard)
  async updateQtBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('postId') postId: string,
    @Args('memberQtInput') memberQtInput: MembersQtInput,
  ) {
    return await this.qtBoardService.update({
      currentUser,
      postId,
      memberQtInput,
    });
  }
  //공지사항 수정
  @UseGuards(GqlAccessGuard)
  @Role(USER_ROLE.ADMIN)
  @Mutation(() => Notice)
  async updateNotice(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('postId') postId: string,
    @Args('title') title: string,
    @Args('contents') contents: string,
  ) {
    return await this.qtBoardService.updateNotice({
      currentUser,
      postId,
      title,
      contents,
    });
  }

  //비회원 게시글 삭제
  @Mutation(() => Boolean)
  async deleteNonMembersQtBoard(
    @Args('password') password: string,
    @Args('postId') postId: string,
  ) {
    return await this.qtBoardService.nonMembersdelete({ postId, password });
  }
  //게시글 삭제
  @UseGuards(GqlAccessGuard)
  @Mutation(() => Boolean)
  async deleteQtBoard(
    @CurrentUser() currentuser: ICurrentUser,
    @Args('postId') postId: string,
  ) {
    return await this.qtBoardService.delete({ currentuser, postId });
  }

  //공지사항 삭제
  @UseGuards(GqlAccessGuard)
  @Role(USER_ROLE.ADMIN)
  @Mutation(() => Boolean)
  async deleteNotice(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('postId') postId: string,
  ) {
    return await this.qtBoardService.deleteNotice({ currentUser, postId });
  }
}
