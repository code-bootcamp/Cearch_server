import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/auth/decorate/currentuser.decorate';
import { GqlAccessGuard } from 'src/common/auth/guard/gqlAuthGuard';
import { IcurrentUser } from '../auth/auth.resolver';
import { ChatRoom } from './schemas/room.schema';
import { SocketService } from './service.socket';

@Resolver()
export class SocketResolver {
  constructor(private readonly socketService: SocketService) {}

  @Query(() => [ChatRoom])
  @UseGuards(GqlAccessGuard)
  async fetchMyRoomInfo(
    @CurrentUser() currentUser: IcurrentUser, //
  ) {
    return await this.socketService.fetchMyRoom({ userId: currentUser.id });
  }

  @Query(() => [ChatRoom])
  @UseGuards(GqlAccessGuard)
  async makeRoom(
    @CurrentUser() currentUser: IcurrentUser, //
  ) {
    return await this.socketService.fetchMyRoom({ userId: currentUser.id });
  }

  @Query(() => [ChatRoom])
  async fetchRooms() {
    return await this.socketService.fetchRooms();
  }
}
