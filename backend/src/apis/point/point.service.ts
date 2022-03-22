import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Point, POINT_STATUS_ENUM } from './entities/point.entity';
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  // async findAllPoint(currentuser) {
  //   console.log(currentuser);
  //   const user = await this.pointRepository.find({
  //     where: {  { id: currentuser.id } },
  //     relations: ['user'],
  //   });
  //   console.log(currentuser.id);
  //   return user;
  // }

  async create({ impUid, myamount, currentuser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      // 1.중복결제 확인
      const myPoint = await queryRunner.manager.findOne(Point, {
        impUid: impUid,
      });
      if (myPoint) throw new ConflictException('이미 결제된 아이디입니다.');
      // 2. 거래기록 생성
      const pointPayment = await this.pointRepository.create({
        impUid: impUid,
        amount: myamount,
        user: currentuser,
        status: POINT_STATUS_ENUM.PAYMENT,
      });

      const user = await queryRunner.manager.findOne(User, {
        where: { id: currentuser.id },
      });
      await this.userRepository.save({
        ...user,
        point: user.point + myamount,
      });

      // await queryRunner.manager.save(updatePoint);
      await queryRunner.manager.save(pointPayment);
      await queryRunner.commitTransaction();
      return pointPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async cancel({ impUid, amount, currentuser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      //중복 취소된 건인지 확인
      const myPoint = await queryRunner.manager.findOne(Point, {
        impUid: impUid,
        status: POINT_STATUS_ENUM.CANCEL,
      });
      console.log('1111', myPoint);
      if (myPoint) throw new ConflictException('이미 취소된 결제아이디입니다.');

      //취소하기에 내 포인트 잔액이 충분한지
      console.log('😂', currentuser);

      const currentPoint = await queryRunner.manager.findOne(Point, {
        impUid: impUid,
        // user: { id: currentuser.id },
        status: POINT_STATUS_ENUM.PAYMENT,
      });
      console.log('222', currentPoint);
      if (!currentPoint)
        throw new UnprocessableEntityException('결제기록이 존재하지 않습니다.');
      const user = await queryRunner.manager.findOne(User, {
        id: currentuser.id,
      });
      console.log(user, '22222');
      if (user.point < currentPoint.amount)
        throw new UnprocessableEntityException('포인트가 부족합니다.');
      //취소기록 생성
      const pointCancel = await this.pointRepository.create({
        impUid: impUid,
        user: currentuser,
        status: POINT_STATUS_ENUM.CANCEL,
        amount: -amount,
      });
      await this.userRepository.save({
        ...user,
        point: user.point + amount,
      });
      await queryRunner.manager.save(pointCancel);
      await queryRunner.commitTransaction();
      return pointCancel;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
