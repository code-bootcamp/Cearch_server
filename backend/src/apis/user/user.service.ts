import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Connection, Repository } from 'typeorm';
import { UserInput } from './dto/user.input';
import { User } from './entities/user.entity';

interface IcreateUserForm {
  userInput: UserInput;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {} //

  async isCheckId({ email }) {
    const result = await this.userRepository.find({ where: { email } });
    if (result) return true;
    return false;
  }

  async sendForm({ userInput }: IcreateUserForm) {
    const { password, ...userInfo } = userInput;
    const hashedPassword = await bcrypt.hash(password, 100); // 해쉬로 비밀번호 바꿔서 저장
    userInput = {
      password: hashedPassword,
      ...userInfo,
    };
    const result = await this.userRepository.save({ ...userInput });
    return result;
  }

  async updatePassword({ email, newPassword }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    queryRunner.startTransaction('REPEATABLE READ');

    const hashedPassword = bcrypt.hash(newPassword, 100);

    try {
      const user = await queryRunner.manager.findOne(User, { email });
      const userUpdated = queryRunner.manager.save(User, {
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
