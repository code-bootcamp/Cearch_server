import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { LectureProduct } from '../lectureProduct/entities/lectureProduct.entity';
import { LectureRegistration } from '../lectureRegistration/entitites/lectureRegistration.entity';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import {
  LectureOrder,
  REGISTRATION_STATUS_ENUM,
} from './entities/lectureOrder.entity';

// Interface
interface IFindOne {
  lectureorderId: string;
  lectureRegistrationId;
  currentuser;
}
interface IUpdate {
  lectureOrderId: string;
}
@Injectable()
export class LectureOrderService {
  constructor(
    @InjectRepository(LectureOrder)
    private readonly lectureOrderRepository: Repository<LectureOrder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LectureRegistration)
    private readonly lectureRegistrationRepository: Repository<LectureRegistration>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(LectureProduct)
    private readonly lectureProductRepository: Repository<LectureProduct>,

    private readonly connection: Connection,
  ) {}

  // Placing order
  async create({ lectureRegistrationId, currentuser }) {
    // 멘티가 신청서ID 중 하나를 찾아 맞으면 결제
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      // Find currentuser
      console.log(currentuser);
      const user = await queryRunner.manager.findOne(User, {
        id: currentuser.id,
      });
      // Find registrationId
      const registration = await getRepository(LectureRegistration)
        .createQueryBuilder('lectureregistration')
        .leftJoinAndSelect('lectureregistration.lecproduct', 'lecproduct')
        .getOne();
      console.log(user);
      if (user.point >= registration.product.classPrice) {
        const payment = await this.lectureOrderRepository.create({
          registrationStatus: REGISTRATION_STATUS_ENUM.PAID,
          order: registration,
        });
        const updateNewuser = await this.userRepository.create({
          ...user,
          point: user.point - registration.product.classPrice,
        });
        const pointHistory = this.walletRepository.create({
          division: '환불',
          description: '포인트를 환불하셨습니다.',
          point: -registration.product.classPrice,
          user: user,
        })
        await queryRunner.manager.save(pointHistory);
        const balance = await queryRunner.manager.save(updateNewuser);
        console.log('결제진행');
        const result = await queryRunner.manager.save(payment);
        await queryRunner.commitTransaction();
        return result;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new NotAcceptableException('잔액이 부족합니다');
    } finally {
      await queryRunner.release();
    }
  }
  // finding all orders
  async findAll() {
    const result = await this.lectureOrderRepository.find({
      relations: ['lectureOrder'],
    });
    return await result;
  }
  // finding one order
  async findOne({ lectureorderId }: IFindOne) {
    return await this.lectureOrderRepository.findOne({
      id: lectureorderId,
    });
  }
  // Update lectureOrder
  async update({ lectureOrderId }: IUpdate) {
    const currentlectureRegistration =
      await this.lectureOrderRepository.findOne({
        id: lectureOrderId,
      });
    const newlectureOrder = {
      ...currentlectureRegistration,
    };
    return await this.lectureOrderRepository.save(newlectureOrder);
  }
  // Cancel order
  async delete({ lectureorderId }) {
    const result = await this.lectureOrderRepository.softDelete({
      id: lectureorderId,
    });
    return result.affected ? true : false;
  }
}
