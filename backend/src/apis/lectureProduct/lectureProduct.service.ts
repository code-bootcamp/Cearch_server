import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_ROLE } from '../user/entities/user.entity';
import { CreateLectureProductInput } from './dto/createLectureProduct.input';
import { UpdateLectureProductInput } from './dto/updateLectureProduct.input';
import { LectureProduct } from './entities/lectureProduct.entity';

// Interface
interface ICreate {
  createLectureProductInput: CreateLectureProductInput;
}

interface IFindOne {
  lectureproductId: string;
}

interface IUpdate {
  lectureproductId: string;
  updateLectureProductInput: UpdateLectureProductInput;
}

@Injectable()
export class LectureProductService {
  constructor(
    @InjectRepository(LectureProduct)
    private readonly lectureProductRepository: Repository<LectureProduct>,
  ) {}

  // Create Class : only mentor has right to create class
  async create({ createLectureProductInput }: ICreate) {
    try {
      const { classTitle, ...rest } = createLectureProductInput;

      if (await this.lectureProductRepository.findOne({ classTitle })) {
        throw new ConflictException('동일한 이름의 클래스가 존재합니다');
      } else if (!USER_ROLE.MENTOR) {
        throw new UnauthorizedException('클래스 개설 권한이 없습니다!');
      }

      return await this.lectureProductRepository.save({
        ...rest,
        classTitle,
      });
    } catch (error) {
      throw error;
    }
  }
  // Find All Class : ReadAll
  async findAll() {
    const result = await this.lectureProductRepository.find({
      relations: ['lectureProduct'],
      withDeleted: false,
    });
    return await result;
  }
  // Find One Class : ReadOne
  async findOne({ lectureproductId }: IFindOne) {
    return await this.lectureProductRepository.findOne({
      id: lectureproductId,
    });
  }
  // Find New Classes
  async findNewClasses() {
    const findNewClasses = await this.lectureProductRepository.find({
      take: 5, // 5개
      order: { createdAt: 'DESC' },
      where: { deletedAt: null },
    });
    return findNewClasses[0];
  }
  // Update Class: only mentor has right to update class
  async update({ lectureproductId, updateLectureProductInput }: IUpdate) {
    const currentlectureproduct = await this.lectureProductRepository.findOne({
      id: lectureproductId,
    });
    const newlectureproduct = {
      ...currentlectureproduct,
      ...updateLectureProductInput,
    };
    return await this.lectureProductRepository.save(newlectureproduct);
  }
  // Delete Class: only mentor has right to delete class
  async delete({ lectureproductId }) {
    const result = await this.lectureProductRepository.softDelete({
      id: lectureproductId,
    });
    return result.affected ? true : false;
  }
}
