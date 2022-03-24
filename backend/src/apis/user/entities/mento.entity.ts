import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CertificateImage } from 'src/apis/certificateImage/entities/certificate.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { JoinMentoAndProductCategory } from './workMento.entity';

export enum MENTOR_AUTH {
  PENDING = 'PENDING',
  AUTHROIZED = 'AUTHORIZED',
  REJECTED = 'REJECTED',
}
registerEnumType(MENTOR_AUTH, { name: 'MENTOR_AUTH' });

@Entity()
@ObjectType()
export class MentoInfo {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String)
  companyName!: string;

  @Column({ nullable: true })
  @Field(() => String)
  department!: string;

  @Column({ default: MENTOR_AUTH.PENDING })
  @Field(() => MENTOR_AUTH, { defaultValue: MENTOR_AUTH.PENDING })
  mentoStatus: string;

  @Column({ nullable: true })
  @Field(() => String)
  selfIntro!: string;

  @OneToMany(() => CertificateImage, (certificate) => certificate.mento)
  @Field(() => [CertificateImage])
  certificate: CertificateImage[];

  @OneToMany(
    () => JoinMentoAndProductCategory,
    (joinMentoAndProductCategory) => joinMentoAndProductCategory.mento,
  )
  @Field(() => [JoinMentoAndProductCategory])
  work: JoinMentoAndProductCategory[];

  @OneToOne(() => User, (user) => user.mentor)
  user: User;
}
