import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum USER_ROLE {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
  ADMIN = 'ADMIN',
}

registerEnumType(USER_ROLE, {
  name: 'USER_ROLE',
});

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  gender: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  phoneNumber!: string;

  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.MENTEE }) //role type 추가
  @Field(() => USER_ROLE)
  role!: USER_ROLE;

  @Column('int', { default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  point: number;

  @Column('int', { default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  following: number;

  @Column('int', { default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  answerCount: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deleteDate: Date;
}
