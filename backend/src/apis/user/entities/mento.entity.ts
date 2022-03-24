import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CertificateImage } from 'src/apis/certificateImage/entities/certificate.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  @Field(() => String)
  companyName: string;

  @Column()
  @Field(() => String)
  department: string;

  @Column({ default: MENTOR_AUTH.PENDING })
  @Field(() => MENTOR_AUTH, { defaultValue: MENTOR_AUTH.PENDING })
  mentoStatus: string;

  @Column()
  @Field(() => String)
  selfIntro: string;

  @OneToMany(() => CertificateImage, (certificate) => certificate.mento)
  @Field(() => [CertificateImage])
  certificate: CertificateImage[];
}
