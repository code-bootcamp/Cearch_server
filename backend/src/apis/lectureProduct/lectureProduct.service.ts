import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { IcurrentUser } from '../auth/auth.resolver';
import { User, USER_ROLE } from '../user/entities/user.entity';
import { CreateLectureProductInput } from './dto/createLectureProduct.input';
import { UpdateLectureProductInput } from './dto/updateLectureProduct.input';
import { LectureProduct } from './entities/lectureProduct.entity';

// Interface
interface ICreate {
  createLectureProductInput: CreateLectureProductInput;
  user: IcurrentUser;
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {}
  async findPopular() {
    const popular = this.lectureProductRepository.find({
      take: 10,
      order: { rating: 'DESC' },
      where: { deletedAt: null },
    });
    return popular;
  }

  // Create Class : only mentor has right to create class
  async create({ createLectureProductInput, user }: ICreate) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const query = await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.mentor', 'mentor')
        .where('user.id = :id', { id: user.id })
        .getOne();
      const mentor = query.mentor;
      console.log('mentor : ', mentor);

      const result = await queryRunner.manager.save(LectureProduct, {
        ...createLectureProductInput,
        mentor,
      });
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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

  async fetchLectureDetail({ lectureId }) {
    const lectureDetail = await this.lectureProductRepository
      .createQueryBuilder('lecture')
      .innerJoinAndSelect('lecture.mentor', 'mentor')
      .innerJoinAndSelect('mentor.user', 'user')
      .where('lecture.id = :lectureId', { lectureId })
      .getOne();
    console.log('lectureDetail : ', lectureDetail);
    return lectureDetail;
  }
}
