import { Field, ObjectType } from '@nestjs/graphql';
import { QtBoard } from 'src/apis/QtBoard/entities/qt.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Likes {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id!: string;

  @ManyToOne(() => QtBoard, (qtBoard) => qtBoard.likes)
  @Field(() => QtBoard)
  qtBoard: QtBoard;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt?: Date;
}
