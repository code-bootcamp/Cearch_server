import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Connection, Repository } from 'typeorm';
import { UserForm } from './dto/user.input';
import { User } from './entities/user.entity';

interface IcreateUserForm {
  userForm: UserForm;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {} //

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
    queryRunner.startTransaction('REPEATABLE READ');

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
}
