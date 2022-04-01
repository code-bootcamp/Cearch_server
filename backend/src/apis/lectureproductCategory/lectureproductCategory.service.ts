import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LectureProductCategory } from './entities/lectureproductCategory.entity';

// Interface
interface IFindOne {
  lectureproductCategoryId: string;
}
@Injectable()
export class LectureProductCategoryService {
  constructor(
    @InjectRepository(LectureProductCategory)
    private readonly lectureproductCategoryRepository: Repository<LectureProductCategory>,
  ) {}
  async create({ categoryname }) {
    return await this.lectureproductCategoryRepository.save({
      categoryname,
    });
  }
  // Find All Class : ReadAll
  async findAll() {
    const result = await this.lectureproductCategoryRepository.find({
      relations: ['lectureProductCategory'],
    });
    return await result;
  }
  // Find One Class : ReadOne
  async findOne({ lectureproductCategoryId }: IFindOne) {
    return await this.lectureproductCategoryRepository.findOne({
      id: lectureproductCategoryId,
    });
  }
  async delete({ lectureproductCategoryId }) {
    const result = await this.lectureproductCategoryRepository.softDelete({
      id: lectureproductCategoryId,
    });
    return result.affected ? true : false;
  }
}
