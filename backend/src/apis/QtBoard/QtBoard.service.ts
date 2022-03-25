import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Comments } from '../comments/entities/comments.entity';
import { User, USER_ROLE } from '../user/entities/user.entity';
import { MembersQtInput } from './dto/membersQtBoard.input';
import { QtBoard } from './entities/qt.entity';
import { Notice } from './entities/notice.entity';

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
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
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
    if (!findOnePost.deletedAt)
      throw new UnprocessableEntityException('삭제된 게시물입니다.');
    return findOnePost;
  }

  //공지사항 10개 가져오기
  async findNoticeAll() {
    const findNotice = await this.noticeRepository.find({
      where: { isNotice: true, deletedAt: null },
      take: 10,
    });
    return findNotice;
  }

  //공지사항 1개 보기
  async findNotice({ postId }) {
    const notice = await this.noticeRepository.findOne({
      id: postId,
    });
    if (!notice.deletedAt)
      throw new UnprocessableEntityException('삭제된 게시물입니다.');
    return notice;
  }

  //홈화면 좋아요 수가 많은 게시물 10개 가져오기
  async findLikePost() {
    const findLikePost = await this.qtBoardRepository.find({
      take: 10, // 한 페이지에 10개
      order: { likescount: 'DESC' },
      where: { deletedAt: null },
      relations: ['comments', 'likes'],
    });
    return findLikePost;
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

  //공지사항생성
  async createNotice({ currentUser, title, contents }) {
    const user = await this.userRepository.findOne({ id: currentUser.id });
    if (user.role !== USER_ROLE.ADMIN) {
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    const createPost = await this.noticeRepository.save({
      title: title,
      contents: contents,
      isNotice: true,
      // user: user,
    });
    console.log(createPost);
    return createPost;
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

  //공지사항 수정
  async updateNotice({ currentUser, postId, title, contents }) {
    const user = await this.userRepository.findOne({ id: currentUser.id });
    if (user.role !== USER_ROLE.ADMIN) {
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    const post = await this.noticeRepository.findOne({ id: postId });
    const newPost = {
      ...post,
      title: title,
      contents: contents,
    };
    const result = await this.noticeRepository.save(newPost);

    return result;
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
      throw new UnauthorizedException('내가 쓴 게시글이 아닙니다');
    }
  }

  //관리자 데이타 삭제
  async deleteNotice({ currentUser, postId }) {
    const user = await this.userRepository.findOne({ id: currentUser.id });
    if (user.role !== USER_ROLE.ADMIN) {
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    const post = await this.noticeRepository.findOne({ id: postId });
    console.log(post);
    if (post) {
      await this.noticeRepository.softDelete({
        id: postId,
      });
      return true;
    } else {
      return false;
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
