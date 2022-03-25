import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Comments } from '../comments/entities/comments.entity';
import { User } from '../user/entities/user.entity';
import { MembersQtInput } from './dto/membersQtBoard.input';
import { QtBoard } from './entities/qt.entity';

interface IFindOne {
  postId: string;
}

interface ICreate {
  currentuser: any;
  memberQtInput: MembersQtInput;
}

interface IUpdate {
  postId: string;
  currentUser: any;
  memberQtInput: MembersQtInput;
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

  //게시판 보기
  async findAll({ page }) {
    const findAllPost = await this.qtBoardRepository.find({
      take: 10, // 한 페이지에 10개
      skip: 10 * (page - 1),
      order: { createdAt: 'DESC' },
      where: { deletedAt: null },
      relations: ['comments', 'likes'],
    });
    return findAllPost;
  }

  //게시글 1개 보기
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

  //홈화면 좋아요 수가 많은 게시물 10개 가져오기
  async findLikePost() {
    const findLikePost = await this.qtBoardRepository.findAndCount({
      take: 10, // 한 페이지에 10개
      order: { likescount: 'DESC' },
      where: { deletedAt: null },
      relations: ['comments', 'likes'],
    });
    return findLikePost[0];
  }

  //내가 한 질문 보기
  async findMyQt({ currentuser, page }) {
    const myQts = await this.qtBoardRepository
      .createQueryBuilder('qtBoard')
      .innerJoinAndSelect('qtBoard.user', 'user')
      .where('user.id = :userId', { userId: currentuser.id })
      .orderBy('qtBoard.createdAt', 'DESC')
      .limit(15)
      .offset(15 * (page - 1))
      .getMany();

    return myQts;
  }

  //비회원 게시글 생성
  async nonMemberCreate({ nonMembersQtInput }) {
    const { password, ...userInfo } = nonMembersQtInput;
    if (password.length < 4) {
      throw new UnprocessableEntityException('4글자 이상 입력해주세요');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 해쉬로 비밀번호 바꿔서 저장
    nonMembersQtInput = {
      password: hashedPassword,
      ...userInfo,
    };
    console.log(nonMembersQtInput);
    const result = await this.qtBoardRepository.save({ ...nonMembersQtInput });
    console.log(result);
    return result;
  }

  //회원 게시글 생성
  async create({ currentuser, memberQtInput }: ICreate) {
    const user = await this.userRepository.findOne({ id: currentuser.id });
    const createPost = await this.qtBoardRepository.save({
      ...memberQtInput,
      user: user,
    });
    return createPost;
  }

  //비회원 게시글 수정
  async nonMembersUpdate({ postId, nonMembersQtInput }) {
    const post = await this.qtBoardRepository.findOne({ id: postId });
    const passwordCheck = await bcrypt.compare(
      nonMembersQtInput.password,
      post.password,
    );
    console.log('passwordCheck : ', passwordCheck);
    if (!passwordCheck) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다');
    }
    const newPost = {
      ...post,
      ...nonMembersQtInput,
      password: post.password,
    };
    const result = await this.qtBoardRepository.save(newPost);
    return result;
  }

  //회원 게시글 수정
  async update({ currentUser, postId, memberQtInput }: IUpdate) {
    const post = await getConnection()
      .createQueryBuilder(QtBoard, 'qtBoard')
      .innerJoinAndSelect('qtBoard.user', 'user')
      .where('user.id = :userId', { userId: currentUser.id })
      .andWhere('qtBoard.id = :Id', { Id: postId })
      .getOne();
    if (post) {
      const newPost = {
        ...post,
        ...memberQtInput,
      };
      const result = await this.qtBoardRepository.save(newPost);
      return result;
    } else {
      return '내가 쓴 게시글이 아닙니다';
    }
  }

  //비회원 게시글 삭제
  async nonMembersdelete({ postId, password }) {
    const post = await this.qtBoardRepository.findOne({ id: postId });
    const passwordCheck = await bcrypt.compare(password, post.password);
    console.log('passwordCheck : ', passwordCheck);
    if (!passwordCheck) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다');
    }
    const deletePost = await this.qtBoardRepository.softDelete({
      id: postId,
    });

    const delteteComment = await this.commentsRepository.softDelete({
      qtBoard: postId,
    });
    if (!delteteComment) return deletePost.affected ? true : false;
    console.log(delteteComment);
    return delteteComment.affected && deletePost.affected ? true : false;
  }

  //회원 게시글 삭제
  async delete({ currentuser, postId }) {
    const deletePost = await getConnection()
      .createQueryBuilder(QtBoard, 'qtBoard')
      .innerJoinAndSelect('qtBoard.user', 'user')
      .where('user.id = :userId', { userId: currentuser.id })
      .andWhere('qtBoard.id = :Id', { Id: postId })
      .getOne();
    if (deletePost) {
      await this.qtBoardRepository.softDelete({
        id: postId,
      });
      await this.commentsRepository.softDelete({
        qtBoard: postId,
      });
      return true;
    } else {
      return false;
    }
  }
}
