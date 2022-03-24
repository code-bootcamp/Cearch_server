import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { QtBoard } from '../QtBoard/entities/qt.entity';
import { User } from '../user/entities/user.entity';
import { Comments } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(QtBoard)
    private readonly qtBoardRepository: Repository<QtBoard>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  //대댓글 보기
  async findAllReComment({ commentId }) {
    const findAllco = await this.commentsRepository.find({
      where: { parent: commentId },
      order: { depth: 'ASC', createdAt: 'ASC' },
    });
    return findAllco;
  }

  //기본 댓글 생성
  async create({ currentuser, postId, contents }) {
    // 포스트 찾기
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const post = await queryRunner.manager.findOne(QtBoard, { id: postId });
      const createcomment = await this.commentsRepository.create({
        contents: contents,
        qtBoard: post,
        user: currentuser,
      });
      console.log(`🔍`, createcomment);
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

  //기본 댓글 수정
  async update({ currentuser, commentId, acontents }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const comment = await queryRunner.manager.findOne(Comments, {
        id: commentId,
      });

      const newcontent = { ...comment, user: currentuser, contents: acontents };
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

  //기본 댓글 삭제
  async delete({ commentId }) {
    const deletsComment = await this.commentsRepository.softDelete({
      id: commentId,
    });
    return deletsComment.affected ? true : false;
  }

  //대댓글 생성
  async createReply({ currentuser, postId, commentId, contents }) {
    const post = await this.qtBoardRepository.findOne({ id: postId });
    const comment = await this.commentsRepository.findOne({ id: commentId });
    const { id, depth, qtBoard, ...rest } = comment;
    const createReco = await this.commentsRepository.save({
      contents: contents,
      parent: id,
      depth: depth + 1,
      qtBoard: post,
      user: currentuser,
    });
    console.log(createReco);
    return createReco;
  }

  //베스트 답변 고르기
  async select({ currentuser, commentId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const selectComment = await queryRunner.manager.findOne(Comments, {
        id: commentId,
      });
      // const user = await queryRunner.manager.findOne(User, {
      //   id: currentuser.id,
      // });
      // if (!user.qtBoard.includes(selectComment.qtBoard))
      //   throw new UnprocessableEntityException('본인이 아닙니다.');
      //Pick 상태로 바꾸어주기
      const pick = { ...selectComment, isPick: 1 };
      const result = await this.commentsRepository.create(pick);
      //포인트 플러스해주기~~
      // console.log(selectComment.user.id);
      // const commentUser = await queryRunner.manager.findOne(User, {
      //   id: selectComment.user.id,
      // });
      // console.log(`🔍`, commentUser);
      // const { point, ...rest } = commentUser;
      // const plusComments = {
      //   ...rest,
      //   point: point + 200,
      // };
      // await queryRunner.manager.save(plusComments);
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
