import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { QtBoard } from '../QtBoard/entities/qt.entity';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
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
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,

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

  async findMyComments({ currentuser, page }) {
    const myQts = await this.commentsRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.qtBoard', 'qtBoard')
      .innerJoinAndSelect('comments.user', 'user')
      .where('user.id = :userId', { userId: currentuser.id })
      .orderBy('comments.createdAt', 'DESC')
      .limit(15)
      .offset(15 * (page - 1))
      .getMany();
    return myQts;
  }

  //기본 댓글 생성
  async create({ currentuser, postId, contents }) {
    // 포스트 찾기
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await queryRunner.manager.findOne(User, {
        id: currentuser.id,
      });
      const post = await queryRunner.manager.findOne(QtBoard, { id: postId });
      const createcomment = await this.commentsRepository.create({
        qtBoard: post,
        contents: contents,
        user: user,
      });
      // const createQtBoard = await this.qtBoardRepository`.create({
      //   ...post
      // });

      console.log(`🍳`, createcomment);
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

      const user = await queryRunner.manager.findOne(User, {
        id: currentuser.id,
      });

      const newcontent = { ...comment, user: user, contents: acontents };
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
  async delete({ currentuser, commentId }) {
    const deleteComment = await this.commentsRepository
      .createQueryBuilder('comments')
      .innerJoinAndSelect('comments.user', 'user')
      .where('user.id = :userId', { userId: currentuser.id })
      .andWhere('comments.id = :Id', { Id: commentId })
      .getOne();
    if (deleteComment) {
      await this.commentsRepository.softDelete({
        id: commentId,
      });
      return true;
    } else {
      return false;
    }
  }

  //대댓글 생성
  async createReply({ currentuser, commentId, contents }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const selectComment = await this.commentsRepository
        .createQueryBuilder('comments')
        .innerJoinAndSelect('comments.user', 'user')
        .innerJoinAndSelect('comments.qtBoard', 'qtBoard')
        .where('comments.id = :Id', { Id: commentId })
        .getOne();
      const user = await queryRunner.manager.findOne(User, {
        id: currentuser.id,
      });
      const { id, depth, qtBoard, ...rest } = selectComment;
      const createReco = await this.commentsRepository.create({
        contents: contents,
        parent: id,
        depth: depth + 1,
        qtBoard: qtBoard,
        user: user,
      });
      await queryRunner.manager.save(createReco);
      await queryRunner.commitTransaction();
      console.log(createReco);
      return createReco;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //베스트 답변 고르기
  async select({ currentuser, commentId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const selectComment = await this.commentsRepository
        .createQueryBuilder('comments')
        .innerJoinAndSelect('comments.user', 'user')
        .innerJoinAndSelect('comments.qtBoard', 'qtBoard')
        .where('comments.id = :Id', { Id: commentId })
        .getOne();
      console.log(selectComment);
      const post = await this.qtBoardRepository
        .createQueryBuilder('qtBoard')
        .innerJoinAndSelect('qtBoard.user', 'user')
        .where('qtBoard.id = :Id', { Id: selectComment.qtBoard.id })
        .andWhere('user.id = :userId', { userId: currentuser.id })
        .getOne();
      console.log(post);
      if (!post) throw new UnprocessableEntityException('본인이 아닙니다.');
      //Pick 상태로 바꾸어주기
      const pick = { ...selectComment, isPick: 1 };
      const result = await this.commentsRepository.create(pick);
      //포인트 플러스해주기~~
      const commentUser = await queryRunner.manager.findOne(User, {
        id: selectComment.user.id,
      });
      // console.log(`🔍`, commentUser);
      // const { point, ...rest } = commentUser;
      const plusPoint = this.userRepository.create({
        ...commentUser,
        point: commentUser.point + 200,
        answerCount: commentUser.answerCount + 1,
      });

      const pointHistory = this.walletRepository.create({
        division: '획득',
        description: '답변이 선택되었습니다.',
        point: +200,
        user: plusPoint,
      });
      await queryRunner.manager.save(plusPoint);
      await queryRunner.manager.save(pointHistory);
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
