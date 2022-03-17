import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comments } from './entities/comments.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}
  @Mutation(() => Comments)
  async createComments(
    @Args('contents') contents: string,
    @Args('postId') postId: string,
  ) {
    return await this.commentsService.create({ postId, contents });
  }
  @Mutation(() => Comments)
  async updateComments(
    @Args('contents') acontents: string,
    @Args('commentId') commentId: string,
  ) {
    return await this.commentsService.update({ commentId, acontents });
  }

  @Mutation(() => Boolean)
  async deleteComments(@Args('commentId') commentId: string) {
    return await this.commentsService.delete({ commentId });
  }

  @Mutation(() => Comments)
  async selectBestComments(@Args('commentId') commentId: string) {
    return await this.commentsService.select({ commentId });
  }
}
