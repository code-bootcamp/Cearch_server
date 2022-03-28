import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Connection, getConnection, Repository } from 'typeorm';
import { IcurrentUser } from '../auth/auth.resolver';
import { LectureProduct } from '../lectureProduct/entities/lectureProduct.entity';
import { MentorForm } from './dto/mentoForm.input';
import { UserForm } from './dto/user.input';
import { MentoInfo, MENTOR_AUTH } from './entities/mento.entity';
import { User, USER_ROLE } from './entities/user.entity';

interface IcreateUserForm {
  userForm: UserForm;
}

interface ImentorForm {
  user: IcurrentUser;
  mentorForm: MentorForm;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MentoInfo)
    private readonly mentoInfoRepository: Repository<MentoInfo>,
    private readonly connection: Connection,
  ) {} //

  async findMyPage({ currentUser }) {
    const myUser = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    return myUser;
  }
  async findMentoPage({ currentUser }) {
    const myUser = getConnection()
      .createQueryBuilder(User, 'user')
      .innerJoinAndSelect('user.mentor', 'mentor')
      .where('user.id = :id', { id: currentUser.id });
    return myUser;
  }

  async findOne({ email }) {
    const myUser = await this.userRepository.findOne({
      where: { email: email },
    });
    return myUser;
  }

  async isCheckEmail({ email }) {
    const result = await this.userRepository.findOne({ where: { email } });
    if (result === undefined) {
      return false;
    }
    return true;
  }

  async saveForm({ userForm }: IcreateUserForm) {
    const { password, ...userInfo } = userForm;
    const hashedPassword = await bcrypt.hash(password, 10); // 해쉬로 비밀번호 바꿔서 저장
    userForm = {
      password: hashedPassword,
      ...userInfo,
    };
    console.log(userForm);
    const result = await this.userRepository.save({ ...userForm });
    return result;
  }

  async updatePassword({ email, newPassword }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      const user = await queryRunner.manager.findOne(User, { email });
      const userUpdated = await queryRunner.manager.save(User, {
        ...user,
        password: hashedPassword,
      });

      await queryRunner.commitTransaction();
      return userUpdated;
    } catch (error) {
      throw new UnprocessableEntityException('MYSQL CANT UPDATE NEW PASSWORD');
    } finally {
      await queryRunner.release();
    }
  }

  async promoteMento({ mentoId, userId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const mento = await queryRunner.manager.findOne(MentoInfo, {
        id: mentoId,
      });
      const user = await queryRunner.manager.findOne(User, {
        id: userId,
      });
      const promotedMento = await queryRunner.manager.save(MentoInfo, {
        ...mento,
        mentoStatus: MENTOR_AUTH.AUTHROIZED,
      });
      await queryRunner.manager.save(User, {
        ...user,
        mentor: promotedMento,
      });
      await queryRunner.commitTransaction();
      return promotedMento;
    } catch (error) {
      throw new UnprocessableEntityException(
        'MYSQL CANT UPDATE MENTOR AUTHROIZED',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async sendMentorForm({ mentorForm, user }: ImentorForm) {
    const querryRunner = this.connection.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction('REPEATABLE READ');
    try {
      const userFind = await querryRunner.manager.findOne(User, {
        where: { id: user.id },
      });
      const mento = await querryRunner.manager.save(MentoInfo, {
        ...mentorForm,
        user: userFind,
      });
      const result = await querryRunner.manager.save(User, {
        ...userFind,
        mentor: mento,
      });
      await querryRunner.commitTransaction();
      return mento;
    } catch (error) {
      console.log(error);
      await querryRunner.rollbackTransaction();
      throw new UnprocessableEntityException('Cant update with mentor Form');
    } finally {
      await querryRunner.release();
    }
  }

  async permitLecture({ currentUser, mentorId, lectureId }) {
    const querryRunner = this.connection.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await querryRunner.manager.findOne(User, {
        id: currentUser.id,
      });
      if (user.role !== USER_ROLE.ADMIN) {
        throw new UnauthorizedException('관리자가 아닙니다.');
      }

      const lecture = await getConnection()
        .createQueryBuilder(MentoInfo, 'mentoinfo')
        .innerJoinAndSelect('mentoinfo.lecture', 'lecture')
        .where('mento.id = :mentoId', { mentoId: mentorId })
        .andWhere('lecture.id = :id', { id: lectureId })
        .getOne();
      if (!lecture) {
        throw new UnprocessableEntityException('허가할 강의가 없습니다.');
      }
      await querryRunner.manager.save(LectureProduct, {
        ...lecture,
        classOpen: true,
      });
    } catch (error) {
      console.log(error);
      await querryRunner.rollbackTransaction();
      throw new UnprocessableEntityException('강의를 허가할 수 없습니다.');
    } finally {
      await querryRunner.release();
    }
  }

  async delete({ currentUser, userId }) {
    const querryRunner = this.connection.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await querryRunner.manager.findOne(User, {
        id: currentUser.id,
      });
      if (user.role !== USER_ROLE.ADMIN) {
        throw new UnauthorizedException('관리자가 아닙니다.');
      }

      const result = await querryRunner.manager.softDelete(User, {
        id: userId,
      });
      await querryRunner.commitTransaction();
      return result.affected ? true : false;
    } catch (error) {
      console.log(error);
      await querryRunner.rollbackTransaction();
      throw new UnprocessableEntityException('유저를 삭제 할 수 없습니다.');
    } finally {
      await querryRunner.release();
    }
  }
}
