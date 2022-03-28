import { Int, Field, ObjectType } from '@nestjs/graphql';
import { Comments } from 'src/apis/comments/entities/comments.entity';
import { LectureProductCategory } from 'src/apis/lectureproductCategory/entities/lectureproductCategory.entity';
import { Likes } from 'src/apis/likes/entities/likes.entity';
import { PostImage } from 'src/apis/postImage/entities/postImage.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class QtBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id!: string;

  @Column()
  @Field(() => String)
  title!: string;

  @Column()
  @Field(() => String)
  contents!: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @Column({ default: 0 })
  @Field(() => Int)
  likescount: number;

  @Column({ default: 0 })
  // @Field(() => String)
  password: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.qtBoard)
  @Field(() => User)
  user: User;

  @OneToMany(() => Comments, (comments) => comments.qtBoard, { nullable: true })
  @Field(() => [Comments], { nullable: true })
  comments: Comments[];

  @OneToMany(() => Likes, (likes) => likes.qtBoard, { nullable: true })
  @Field(() => [Likes], { nullable: true })
  likes?: Likes[];

  @OneToMany(() => PostImage, (postImage) => postImage.qtBoard)
  @Field(() => [PostImage])
  image: PostImage[];

  @OneToMany(() => LectureProductCategory, (category) => category.qtBoard, {
    nullable: true,
  })
  @Field(() => [LectureProductCategory], { nullable: true })
  qtTags: LectureProductCategory[];
}
