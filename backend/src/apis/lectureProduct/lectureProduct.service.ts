import { All, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import { IcurrentUser } from '../auth/auth.resolver';
import { JoinLectureAndProductCategory } from '../lectureproductCategory/entities/lectureproductCagtegoryclassCategory.entity';
import { LectureProductCategory } from '../lectureproductCategory/entities/lectureproductCategory.entity';
import { MentoInfo } from '../user/entities/mento.entity';
import { User, USER_ROLE } from '../user/entities/user.entity';
import { CreateLectureProductInput } from './dto/createLectureProduct.input';
import { LectureProduct } from './entities/lectureProduct.entity';

// Interface
interface ICreate {
  createLectureProductInput: CreateLectureProductInput;
  user: IcurrentUser;
}

interface IFindOne {
  lectureproductId: string;
  page: number;
}

interface IUpdate {
  lectureproductId: string;
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
    @InjectRepository(JoinLectureAndProductCategory)
    private readonly joinlectureandproductRepository: Repository<JoinLectureAndProductCategory>,

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
      const { classCategories, ...rest } = createLectureProductInput;
      const query = await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.mentor', 'mentor')
        .where('user.id = :id', { id: user.id })
        .getOne();
      const mentor = query.mentor;
      console.log('mentor : ', mentor);

      const result = await this.lectureProductRepository.save({
        ...rest,
        mentor: mentor,
      });
      //
      const categories = [];
      for (let i = 0; i < classCategories.length; i++) {
        const lecturecategories = classCategories[i].replace('#', '');
        // 프로덕트카테고리레포에서 categoryname 찾기
        const prevTag = await this.lectureproductCategoryRepository.findOne({
          categoryname: lecturecategories,
        });

        const join = await this.joinlectureandproductRepository.save({
          lectureproductcategory: prevTag,
          lectureproduct: result,
        });
        categories.push(join);
      }
      // 프로덕트레포에서
      const result2 = await this.lectureProductRepository.create({
        ...result,
        joinproductandproductcategory: categories,
      });
      await queryRunner.manager.save(result2); //LectureProduct
      await queryRunner.commitTransaction();
      return result2;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Find All Class : ReadAll
  async findAll() {
    const workctg = this.mentoinfoRepository.find();
    const result = await this.lectureProductRepository

      .createQueryBuilder('product')
      .leftJoinAndSelect('product.joinproductandproductcategory', 'jlpc')
      .leftJoinAndSelect('jlpc.lectureproductcategory', 'lpc')
      .leftJoinAndSelect('product.mentor', 'mentor')
      .leftJoinAndSelect('mentor.user', 'user')

      .getMany();
    console.log('result : ', result);
    return result;
  }

  // Find One Class : ReadOne
  async findOne({ lectureproductId }: IFindOne) {
    const lecture = await this.lectureProductRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.joinproductandproductcategory', 'jlpc')
      .leftJoinAndSelect('jlpc.lectureproductcategory', 'lpc')
      .leftJoinAndSelect('product.mentor', 'mentor')
      .leftJoinAndSelect('mentor.user', 'user')
      .leftJoinAndSelect('mentor.work', 'work')
      .leftJoinAndSelect('work.category', 'category')
      .where('product.id = :id', { id: lectureproductId })
      .getOne();
    console.log(lecture);
    return lecture;
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
  async fetchSelectedTagLectures({ lectureproductcategoryId, page }) {
    const selectedtag = await getConnection()
      .createQueryBuilder(LectureProduct, 'product')
      .innerJoinAndSelect('product.joinproductandproductcategory', 'jointable')
      .innerJoinAndSelect('jointable.lectureproductcategory', 'category')
      .leftJoinAndSelect('product.mentor', 'mentor')
      .leftJoinAndSelect('mentor.user', 'user')
      .where('category.id = :lectureproductId', {
        lectureproductId: lectureproductcategoryId,
      })
      // .orderBy('jointable.createdAt', 'DESC')
      .limit(40)
      .offset(15 * (page - 1))
      .getMany();
    return selectedtag;
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
  async update({ lectureproductId }: IUpdate) {
    const currentlectureproduct = await this.lectureProductRepository.findOne({
      id: lectureproductId,
    });
    const newlectureproduct = {
      ...currentlectureproduct,
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
