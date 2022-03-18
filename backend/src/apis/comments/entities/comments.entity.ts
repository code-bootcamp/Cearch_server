import { Int, Field, ObjectType } from '@nestjs/graphql';
import { QtBoard } from 'src/apis/QtBoard/entities/qt.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum COMMENT_ISPICK_ENUM {
  NORMAL = 'NORMAL',
  PICK = 'PICK',
}

@Entity()
@ObjectType()
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id!: string;

  @Column()
  @Field(() => String)
  contents!: string;

  @Column({
    type: 'enum',
    enum: COMMENT_ISPICK_ENUM,
    default: COMMENT_ISPICK_ENUM.NORMAL,
  })
  @Field(() => String, { nullable: true })
  isPick!: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt?: Date;

  @ManyToOne(() => QtBoard, (qtBoard) => qtBoard.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => QtBoard)
  qtBoard: QtBoard;
}
