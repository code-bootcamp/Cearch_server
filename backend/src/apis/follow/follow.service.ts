import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
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
    @InjectRepository(MentoInfo)
    private readonly mentoInfoRepostiory: Repository<MentoInfo>,
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

  async fetchMostRecommendMentor() {
    const result = await getManager().query(`
    select f.followeeId ,(SELECT COUNT(*) FROM follow f2 where f2.followeeId = f.followeeId 
    and f2.following >= 1)as cnt
    FROM  follow f
    GROUP BY f.followeeId
    ORDER BY cnt DESC
    LIMIT 10`);
    console.log(result);
    const result_list = [];
    for (const ele of result) {
      const mentoInfo = await this.mentoInfoRepostiory
        .createQueryBuilder('mento')
        .innerJoinAndSelect('mento.user', 'user')
        .innerJoinAndSelect('mento.work', 'work')
        .innerJoinAndSelect('work.category', 'ctg')
        .where('mento.id = :id', { id: ele.followeeId })
        .getOne();
      console.log('mentoinfo : ', mentoInfo);
      result_list.push(mentoInfo);
    }
    console.log('result list : ', result_list);
    return result_list;
  }

  async fetchMostAnswerMentor() {
    const mentorInfo = await this.mentoInfoRepostiory
      .createQueryBuilder('mento')
      .innerJoinAndSelect('mento.user', 'user')
      .innerJoinAndSelect('mento.work', 'work')
      .innerJoinAndSelect('work.category', 'ctg')
      .orderBy('user.answerCount', 'DESC')
      .limit(10)
      .getMany();
    console.log(mentorInfo);
    return mentorInfo;
  }
}
