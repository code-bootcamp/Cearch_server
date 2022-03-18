import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LectureProductCategory } from './entities/lectureproductCategory.entity';

@Injectable()
export class LectureProductCategoryService {
  constructor(
    @InjectRepository(LectureProductCategory)
    private readonly lectureproductCategoryRepository: Repository<LectureProductCategory>,
  ) {}
  async create({ tagname }) {
    // 카테고리를 database에 저장
    return await this.lectureproductCategoryRepository.save({ tagname });
  }

  async delete({ lectureproductCategoryId }) {
    return await this.lectureproductCategoryRepository.delete({
      id: lectureproductCategoryId,
    });
  }
}
