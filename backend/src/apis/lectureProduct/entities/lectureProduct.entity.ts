import {
  Field,
  Float,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { LectureImage } from 'src/apis/LectureImage/entities/lectureImage.entity';
import { JoinLectureAndProductCategory } from 'src/apis/lectureproductCategory/entities/lectureproductCagtegoryclassCategory.entity';
import { LectureRegistration } from 'src/apis/lectureRegistration/entitites/lectureRegistration.entity';
import { LectureReview } from 'src/apis/lectureReview/entities/lectureReview.entity';
import { MentoInfo } from 'src/apis/user/entities/mento.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// export enum CLASS_CATEGORY {
//   DEFAULT = '카테고리 선택', HTML = 'HTML', CSS = 'CSS', JS = 'JS',
//   TS = 'TS',REACT = 'REACT',PYTHON = 'PYTHON',C = 'C',
//   CSHARP = 'C#',PHP = 'PHP, NODEJS = 'NODE.JS',MYSQL = 'MySQL',
//   DOCKER = 'DOCKER', LIB = 'LIBRARY',REACTNATIVE = 'REACT-NATIVE',
//   RUBY = 'RUBY',MONGODB = 'MONGODB',VUEJS = 'VUE.JS',
//   GRAPHQL = 'GraphQL',RESTAPI = 'RestAPI',SERVICE = 'AWS/GCP/AZURE',
// }
// registerEnumType(CLASS_CATEGORY, {
//   name: 'CLASS_CATEGORY',
// });
@Entity()
@ObjectType()
export class LectureProduct {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String, { nullable: true })
  classTitle: string;


  @Column({
    type: 'enum',
    enum: CLASS_CATEGORY,
    default: CLASS_CATEGORY.DEFAULT,
    nullable: true,
  })
  @Field(() => CLASS_CATEGORY, { nullable: true })
  classCategory!: CLASS_CATEGORY;


  @Column()
  @Field(() => String, { nullable: true })
  classDescription: string;

  @Column()
  @Field(() => String, { nullable: true })
  classCurriculum: string

  @Column()
  @Field(() => Int, { nullable: true })
  classPrice: number;

  @Column()
  @Field(() => Int, { nullable: true })
  classMaxUser: number;

  @Column()
  @Field(() => String, { nullable: true })
  classStartDate: string;

  @Column()
  @Field(() => String, { nullable: true })
  classStartTime: string

  @Column({ default: 0, type: 'float' })
  @Field(() => Float, { nullable: true })
  rating: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt?: Date;

  @OneToMany(() => LectureImage, (image) => image.product)
  @Field(() => [LectureImage])
  image: LectureImage[];

  @OneToMany(() => LectureReview, (review) => review.user, { nullable: true })
  @Field(() => [LectureReview], { nullable: true })
  reviews: LectureReview[];

  // Lecture Product Category와 중간 테이블과 1:N 연결
  @JoinColumn()
  @OneToMany(
    () => JoinLectureAndProductCategory,
    (joinproductandproductcategory) =>
      joinproductandproductcategory.lectureproduct,
      { nullable: true } )
  @Field(() => [JoinLectureAndProductCategory],{ nullable: true })
  joinproductandproductcategory: JoinLectureAndProductCategory[];

  // LectureRegistration과 1:N 연결
  @OneToMany(() => LectureRegistration, (registration) => registration.product)
  @Field(() => [LectureRegistration])
  registration: LectureRegistration[];

  @ManyToOne(() => MentoInfo, (mentoInfo) => mentoInfo.lecture)
  @Field(() => MentoInfo)
  mentor: MentoInfo;
}
