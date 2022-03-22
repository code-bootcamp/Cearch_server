import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../comments/entities/comments.entity';
import { User } from '../user/entities/user.entity';
import { CreateQtBoardInput } from './dto/createQtBoard.input';
import { UpdateQtBoardInput } from './dto/updateQtBoard.input';
import { QtBoard } from './entities/qt.entity';

interface IFindOne {
  postId: string;
}

interface ICreate {
  currentuser: any;
  createQtBoardInput: CreateQtBoardInput;
}

interface IUpdate {
  postId: string;
  updateQtBoardInput: UpdateQtBoardInput;
}

@Injectable()
export class QtBoardService {
  constructor(
    @InjectRepository(QtBoard)
    private readonly qtBoardRepository: Repository<QtBoard>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({ page }) {
    const findAllPost = await this.qtBoardRepository.findAndCount({
      take: 10, // 한 페이지에 10개
      skip: 10 * (page - 1),
      order: { createdAt: 'DESC' },
      where: { deletedAt: null },
      relations: ['comments', 'likes'],
    });
    return findAllPost[0];
  }

  async findOne({ postId }: IFindOne) {
    const findOnePost = await this.qtBoardRepository
      .createQueryBuilder('qtBoard')
      .leftJoinAndSelect('qtBoard.comments', 'comment')
      .leftJoinAndSelect('qtBoard.likes', 'likes')
      .where('qtBoard.id = :id', { id: postId })
      .andWhere(`comment.parent = :parent`, { parent: '1' }) //parent 가 1인 댓글만 찾기
      .orderBy('comment.isPick', 'DESC')
      .addOrderBy('comment.createdAt')
      .getOne();

    return findOnePost;
  }
  async findLikePost() {
    const findLikePost = await this.qtBoardRepository.findAndCount({
      take: 10, // 한 페이지에 10개
      order: { likescount: 'DESC' },
      where: { deletedAt: null },
      relations: ['comments', 'likes'],
    });
    return findLikePost[0];
  }

  async create({ currentuser, createQtBoardInput }: ICreate) {
    const user = await this.userRepository.findOne({ id: currentuser.id });
    const createPost = await this.qtBoardRepository.save({
      ...createQtBoardInput,
      user: user,
    });
    return createPost;
  }
  async update({ postId, updateQtBoardInput }: IUpdate) {
    const post = await this.qtBoardRepository.findOne({ id: postId });
    const newPost = {
      ...post,
      ...updateQtBoardInput,
    };
    const result = await this.qtBoardRepository.save(newPost);
    return result;
  }

  async delete({ postId }) {
    const deletePost = await this.qtBoardRepository.softDelete({
      id: postId,
    });
    const delteteComment = await this.commentsRepository.softDelete({
      qtBoard: postId,
    });
    return delteteComment.affected && deletePost.affected ? true : false;
  }

  // async qtlike({ postId }) {
  //   const post = await this.qtBoardRepository.findOne({ id: postId });
  //   console.log(post.likes)
  // }
}
