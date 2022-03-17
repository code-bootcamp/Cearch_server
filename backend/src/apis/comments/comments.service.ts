import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { QtBoard } from '../QtBoard/entities/QTboard.entity';
import { Comments, COMMENT_ISPICK_ENUM } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(QtBoard)
    private readonly qtBoardRepository: Repository<QtBoard>,

    private readonly connection: Connection,
  ) {}
  async create({ postId, contents }) {
    // 포스트 찾기
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const post = await queryRunner.manager.findOne(QtBoard, { id: postId });
      const createcomment = await this.commentsRepository.create({
        qtBoard: post,
        contents: contents,
      });
      await queryRunner.manager.save(createcomment);
      await queryRunner.commitTransaction();
      return createcomment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update({ commentId, acontents }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const comment = await queryRunner.manager.findOne(Comments, {
        id: commentId,
      });

      const newcontent = { ...comment, contents: acontents };
      const result = await this.commentsRepository.create(newcontent);
      await queryRunner.manager.save(result);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async delete({ commentId }) {
    const deletsComment = await this.commentsRepository.softDelete({
      id: commentId,
    });
    return deletsComment.affected ? true : false;
  }

  async select({ commentId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const selectComment = await queryRunner.manager.findOne(Comments, {
        id: commentId,
      });
      //Pick 상태로 바꾸어주기
      const pick = { ...selectComment, isPick: COMMENT_ISPICK_ENUM.PICK };
      const result = await this.commentsRepository.create(pick);
      //포인트 플러스해주기~~

      await queryRunner.manager.save(result);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
