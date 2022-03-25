import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CurrentUser,
  ICurrentUser,
} from 'src/common/auth/decorate/currentuser.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { NonMembersQtInput } from './dto/nonMembersQt';
import { MembersQtInput } from './dto/membersQtBoard.input';
import { QtBoard } from './entities/qt.entity';
import { QtBoardService } from './QtBoard.service';
import { Role } from 'src/common/auth/decorate/role.decorate';
import { USER_ROLE } from '../user/entities/user.entity';
import { Notice } from './entities/notice.entity';
import { title } from 'process';

@Resolver()
export class QtBoardResolver {
  constructor(private readonly qtBoardService: QtBoardService) {}

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

  //게시글 생성
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

  //비회원 게시글 생성
  @Mutation(() => QtBoard)
  async createNonMembersQtBoard(
    @Args('nonMembersQtInput') nonMembersQtInput: NonMembersQtInput,
  ) {
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
