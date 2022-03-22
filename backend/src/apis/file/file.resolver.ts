import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/auth/decorate/currentuser.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { IcurrentUser } from '../auth/auth.resolver';
import { User } from '../user/entities/user.entity';
import { FileUploadService } from './file.service';

@Resolver()
export class FileUploadResolver {
  constructor(
    private readonly fileUploadService: FileUploadService, //
  ) {}

  @Query(() => [String])
  @UseGuards(GqlAccessGuard)
  async putSignedUrlUser(
    @Args({ name: 'fileNames', type: () => [String] }) fileNames: string[], //
    @Args('id') id: string,
    // @CurrentUser() currentUser: IcurrentUser,
  ) {
    return await this.fileUploadService.putSignedUrl({
      fileNames,
      userId: id,
      // userId: currentUser.id,
    });
  }

  @Query(() => String)
  async getSignedUrlUser(
    @CurrentUser() currentUser: IcurrentUser, //
  ) {
    return await this.fileUploadService.getSignedUrl({
      user: currentUser,
    });
  }

  @Mutation(() => User)
  async urlToDbUser(
    @CurrentUser() currentUser: IcurrentUser, //
  ) {
    return await this.fileUploadService.getSignedUrl({
      user: currentUser,
    });
  }
}
