import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

interface IDelete {
  lectureproductId: string;
}

@Injectable()
export class LectureProductService {
  constructor(
    @InjectRepository(LectureProduct)
    private readonly lectureProductRepository: Repository<LectureProduct>,
  ) {}

  // Create Class
  async create({ createLectureProductInput }: ICreate) {
    try {
      const { classTitle, ...rest } = createLectureProductInput;

      if (await this.lectureProductRepository.findOne({ classTitle })) {
        throw new ConflictException();
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
      withDeleted: true,
    });
    return await this.lectureProductRepository.find();
  }
  // Find One Class : ReadOne
  async findOne({ lectureproductId }: IFindOne) {
    return await this.lectureProductRepository.findOne({
      id: lectureproductId,
    });
  }
  // Update Class
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
  // Delete Class
  async delete({ lectureproductId }: IDelete) {
    const result = await this.lectureProductRepository.softDelete({
      id: lectureproductId,
    });
    return result.affected ? true : false;
  }
}
