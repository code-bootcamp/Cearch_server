import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { LectureProduct } from '../lectureProduct/entities/lectureProduct.entity';
import { User } from '../user/entities/user.entity';
import { LectureReview } from './entities/lectureReview.entity';

@Injectable()
export class LectureReviewService {
  constructor(
    @InjectRepository(LectureReview)
    private readonly lectureReviewRepository: Repository<LectureReview>,

    @InjectRepository(LectureProduct)
    private readonly lectureProductRepository: Repository<LectureProduct>,

    private readonly connection: Connection,
  ) {}

  async findLectureReviews({ lectureId }) {
    const findAllReview = await this.lectureReviewRepository.find({
      where: { lecture: { id: lectureId } },
      order: { createdAt: 'DESC' },
    });
    console.log(findAllReview);
    return findAllReview;
  }

  async findOne({ currentuser, reviewId }) {
    const findOneReview = await this.lectureReviewRepository
      .createQueryBuilder('review')
      .innerJoinAndSelect('review.user', 'user')
      .where('user.id = :userId', { userId: currentuser.id })
      .andWhere('review.id = :reviewId', { reviewId: reviewId })
      .orderBy('review.createdAt', 'DESC')
      .getOne();
    return findOneReview;
  }

  async create({ currentuser, createReviewInput }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const lecture = await queryRunner.manager.findOne(LectureProduct, {
        id: createReviewInput.lectureProductId,
      });

      const user = await queryRunner.manager.findOne(User, {
        id: currentuser.id,
      });
      const { rating, reviews, ...rest } = lecture;
      console.log(rating, '🎁', reviews);
      const updateLecture = await this.lectureProductRepository.create({
        ...lecture,
        rating: rating + createReviewInput.starRating / reviews.length + 1,
      });

      const createReview = await this.lectureReviewRepository.create({
        ...createReviewInput,
        lecture: updateLecture,
        user: user,
      });
      await queryRunner.manager.save(updateLecture);
      await queryRunner.manager.save(createReview);
      await queryRunner.commitTransaction();
      return createReview;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async update({ currentuser, updateReviewInput }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const review = await queryRunner.manager.findOne(LectureReview, {
        id: updateReviewInput.reviewId,
      });
      const user = await queryRunner.manager.findOne(User, {
        id: currentuser.id,
      });

      const createReview = await this.lectureReviewRepository.create({
        ...review,
        ...updateReviewInput,
        user: user,
      });

      await queryRunner.manager.save(createReview);
      await queryRunner.commitTransaction();
      return createReview;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete({ currentuser, reviewId }) {
    const deleteReview = await this.lectureReviewRepository
      .createQueryBuilder('review')
      .innerJoinAndSelect('review.user', 'user')
      .where('user.id = :userId', { userId: currentuser.id })
      .andWhere('review.id = :reviewId', { reviewId: reviewId })
      .getOne();

    if (deleteReview) {
      await this.lectureReviewRepository.softDelete({
        id: reviewId,
      });
      return true;
    } else {
      return false;
    }
  }
}
