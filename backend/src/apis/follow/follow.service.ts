import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import { IcurrentUser } from '../auth/auth.resolver';
import { MentoInfo } from '../user/entities/mento.entity';
import { User } from '../user/entities/user.entity';
import { Follow } from './entities/follow.entity';

interface IfolloInput {
  user: IcurrentUser;
  mentoId: string;
}

@Injectable()
export class FollowService {
  constructor(
    private readonly connection: Connection, //
    @InjectRepository(Follow)
    private readonly followRepostiory: Repository<Follow>,
  ) {}

  async followToggle({ user, mentoId }: IfolloInput) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const followInfo = await this.followRepostiory
        .createQueryBuilder('follow')
        .where('follow.follower = :userId', { userId: user.id })
        .andWhere('follow.followee = :mentoId', { mentoId })
        .getOne();
      console.log('fffollowInffo : ', followInfo);
      if (followInfo === undefined) {
        const userFind = await queryRunner.manager.findOne(User, {
          id: user.id,
        });
        const mentoFind = await queryRunner.manager.findOne(MentoInfo, {
          id: mentoId,
        });
        const result = await queryRunner.manager.save(Follow, {
          follower: userFind,
          followee: mentoFind,
          following: true,
        });
        console.log(result);
        await queryRunner.commitTransaction();
        return result;
      }
      const followFind = await queryRunner.manager.findOne(Follow, {
        id: followInfo.id,
      });
      console.log('hellllooooo : ', followFind);
      const result = await queryRunner.manager.save(Follow, {
        ...followFind,
        following: !followFind.following,
      });
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException('cannot Update Follow');
    } finally {
      await queryRunner.release();
    }
  }
}
