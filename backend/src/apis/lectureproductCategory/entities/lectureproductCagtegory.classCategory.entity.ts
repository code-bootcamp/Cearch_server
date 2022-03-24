import { Field, ObjectType } from '@nestjs/graphql';
import { LectureProduct } from 'src/apis/lectureProduct/entities/lectureProduct.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LectureProductCategory } from './lectureproductCategory.entity';

@Entity()
@ObjectType()
export class JoinLectureAndProductCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // LectureProductCategory와 N:1 연결
  @ManyToOne(
    () => LectureProductCategory,
    (linkedToLectureProductCategory) => linkedToLectureProductCategory.category,
  )
  @Field(() => LectureProductCategory)
  linkedToLectureProductCategory: LectureProductCategory;

  // LectureProduct와 N:1 연결
  @ManyToOne(
    () => LectureProduct,
    (linkedToLectureProduct) => linkedToLectureProduct.lecproduct,
  )
  @Field(() => LectureProduct)
  linkedToLectureProduct: LectureProduct;
}
