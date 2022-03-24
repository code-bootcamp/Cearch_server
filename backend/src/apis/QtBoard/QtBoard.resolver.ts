import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CurrentUser,
  ICurrentUser,
} from 'src/common/auth/decorate/currentuser.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { CreateQtBoardInput } from './dto/createQtBoard.input';
import { UpdateQtBoardInput } from './dto/updateQtBoard.input';
import { QtBoard } from './entities/qt.entity';
import { QtBoardService } from './QtBoard.service';

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
    @Args('createQtBoardInput') createQtBoardInput: CreateQtBoardInput,
  ) {
    return await this.qtBoardService.create({
      currentuser,
      createQtBoardInput,
    });
  }
  //게시글 수정
  @UseGuards(GqlAccessGuard)
  @Mutation(() => QtBoard)
  async updateQtBoard(
    @Args('postId') postId: string,
    @Args('updateQtBoardInput') updateQtBoardInput: UpdateQtBoardInput,
  ) {
    return await this.qtBoardService.update({
      postId,
      updateQtBoardInput,
    });
  }
  //게시글 삭제
  @UseGuards(GqlAccessGuard)
  @Mutation(() => Boolean)
  async deleteQtBoard(@Args('postId') postId: string) {
    return await this.qtBoardService.delete({ postId });
  }

  // @Mutation(() => Boolean)
  // async updateQtLike(@Args('postId') postId: string) {
  //   return await this.qtBoardService.qtlike({ postId });
  // }
  // @Mutation(() => QtBoard)
  // async updateLikePost(@Args('postId') postId: string) {
  //   return await this.qtBoardService.like({ postId });
  // }
}
