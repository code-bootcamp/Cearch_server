import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateQtBoardInput } from './dto/createQtBoard.input';
import { UpdateQtBoardInput } from './dto/updateQtBoard.input';
import { QtBoard } from './entities/QTboard.entity';
import { QtBoardService } from './QtBoard.service';

@Resolver()
export class QtBoardResolver {
  constructor(private readonly qtBoardService: QtBoardService) {}

  @Query(() => [QtBoard])
  async fetchQtBoards(@Args('page') page: number) {
    return await this.qtBoardService.findAll({ page });
  }
  @Query(() => [QtBoard])
  async fetchLikePost() {
    return await this.qtBoardService.findLikePost();
  }
  @Query(() => QtBoard)
  async fetchQtBoard(@Args('postId') postId: string) {
    return await this.qtBoardService.findOne({ postId });
  }

  @Mutation(() => QtBoard)
  async createQtBoard(
    @Args('createQtBoardInput') createQtBoardInput: CreateQtBoardInput,
  ) {
    return await this.qtBoardService.create({ createQtBoardInput });
  }
  @Mutation(() => QtBoard)
  async updateQtBoard(
    @Args('postId') postId: string,
    @Args('updateQtBoardInput') updateQtBoardInput: UpdateQtBoardInput,
  ) {
    return await this.qtBoardService.update({ postId, updateQtBoardInput });
  }
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
