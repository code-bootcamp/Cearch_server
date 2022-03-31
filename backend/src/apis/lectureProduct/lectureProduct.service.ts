import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'src/common/auth/decorate/currentuser.decorate';
import { Connection, getConnection, Repository } from 'typeorm';
import { IcurrentUser } from '../auth/auth.resolver';
import { JoinLectureAndProductCategory } from '../lectureproductCategory/entities/lectureproductCagtegoryclassCategory.entity';
import { LectureProductCategory } from '../lectureproductCategory/entities/lectureproductCategory.entity';
import { MentoInfo } from '../user/entities/mento.entity';
import { User, USER_ROLE } from '../user/entities/user.entity';
import { CreateLectureProductInput } from './dto/createLectureProduct.input';
import { UpdateLectureProductInput } from './dto/updateLectureProduct.input';
import {
  LectureProduct,
  CLASS_CATEGORY,
} from './entities/lectureProduct.entity';

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
    @InjectRepository(LectureProductCategory)
    private readonly lectureproductCategoryRepository: Repository<LectureProductCategory>,
    @InjectRepository(MentoInfo)
    private readonly mentoinfoRepository: Repository<MentoInfo>,

    private readonly connection: Connection,
  ) {}

  async findPopular() {
    const popular = await this.lectureProductRepository
      .createQueryBuilder('lecture')
      .leftJoinAndSelect('lecture.mentor', 'mentor')
      .leftJoinAndSelect('mentor.user', 'user')
      .orderBy('lecture.rating', 'DESC')
      .take(10)
      .getMany();

    console.log('popular : ', popular);
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
      // const mentor = await this.mentoinfoRepository
      // .createQueryBuilder('mentor')
      // .leftJoinAndSelect("mentor.user",'user')
      // .where('user.id = :id' , {id : user.id})
      // .getOne()
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
    const result = await this.lectureProductRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.mentor', 'mentor')
      .leftJoinAndSelect('mentor.user', 'user')
      .getMany();
    console.log('result : ', result);
    return result;
  }

  // Find One Class : ReadOne
  async findOne({ lectureproductId }: IFindOne) {
    return await this.lectureProductRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.mentor', 'mentor')
      .leftJoinAndSelect('mentor.user', 'user')
      .where('product.id = :id', { id: lectureproductId })
      .getOne();
  }

  // Find New Classes
  async findNewClasses() {
    const findNewClasses = await this.lectureProductRepository.find({
      take: 10, // 5개
      order: { createdAt: 'DESC' },
      where: { deletedAt: null },
    });
    return findNewClasses;
  }

  // Find SelectedTag Classes
  async fetchSelectedTagLectures({ lectureproduct }) {
    const select = await getConnection()
      .createQueryBuilder(LectureProduct, 'lectureproduct')
      .innerJoinAndSelect(
        'lectureproduct.joinproductandproductcategory',
        'lecture',
      )
      .innerJoinAndSelect('lecture.lectureproductcategory', 'lpcategory')
      // .innerJoinAndSelect('lpcategory.category', 'category')
      .where('lpcategory.categoryname = :categoryname', {
        categoryname: lectureproduct.classCategory,
      })
      .orderBy('lectureproduct.createdAt', 'DESC')
      .limit(3)
      .getMany();
    return select;
  }

  // Find Lectures with Mentor
  async findLectureWithMentor({ currentuser }) {
    const mylecturefinder = await this.lectureProductRepository
      .createQueryBuilder('lecture')
      .innerJoinAndSelect('lecture.mentor', 'mentor')
      .where('mentor.id = :id', { id: currentuser.id })
      .getMany();
    return mylecturefinder;
  }

  // Find registered Lectures
  async findLectureWithMentee({ currentuser }) {
    const registeredlecturefinder = await this.lectureProductRepository
      .createQueryBuilder('lecture')
      .innerJoinAndSelect('lecture.user', 'user')
      .where('user.id = :id', { id: currentuser.id })
      .getMany();
    return registeredlecturefinder;
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

  // Fetch Lecture Detail
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
