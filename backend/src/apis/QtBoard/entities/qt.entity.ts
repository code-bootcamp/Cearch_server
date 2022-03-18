import { Int, Field, ObjectType } from '@nestjs/graphql';
import { Comments } from 'src/apis/comments/entities/comments.entity';
import { Likes } from 'src/apis/likes/entities/likes.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @Column({ default: 0 })
  @Field(() => Int)
  likescount: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt?: Date;

  @OneToMany(() => Comments, (comments) => comments.qtBoard, {
    cascade: true,
  })
  @Field(() => [Comments])
  comments: Comments[];

  @OneToMany(() => Likes, (likes) => likes.qtBoard, {
    cascade: true,
  })
  @Field(() => Likes)
  likes?: Likes[];
}
