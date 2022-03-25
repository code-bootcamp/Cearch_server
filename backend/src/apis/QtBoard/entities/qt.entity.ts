import { Int, Field, ObjectType } from '@nestjs/graphql';
import { Comments } from 'src/apis/comments/entities/comments.entity';
import { Likes } from 'src/apis/likes/entities/likes.entity';
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

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.qtBoard, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => User)
  user: User;

  @OneToMany(() => Comments, (comments) => comments.qtBoard, {})
  @Field(() => [Comments])
  comments: Comments[];

  @OneToMany(() => Likes, (likes) => likes.qtBoard, {})
  @Field(() => [Likes])
  likes?: Likes[];
}
