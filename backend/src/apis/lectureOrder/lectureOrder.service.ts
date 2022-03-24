import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLectureOrderInput } from './dto/createlectureOrder.input';
import { LectureOrder } from './entities/lectureOrder.entity';

// Interface
interface ICreate {
  createLectureOrderInput: CreateLectureOrderInput;
}
interface IFindOne {
  lectureorderId: string;
}
@Injectable()
export class LectureOrderService {
  constructor(
    @InjectRepository(LectureOrder)
    private readonly lectureOrderRepository: Repository<LectureOrder>,
  ) {}

  // Placing order
  async create({ createLectureOrderInput }: ICreate) {
    return await this.lectureOrderRepository.save({});
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
  // Cancel order
  async delete({ lectureorderId }) {
    const result = await this.lectureOrderRepository.softDelete({
      id: lectureorderId,
    });
    return result.affected ? true : false;
  }
}
