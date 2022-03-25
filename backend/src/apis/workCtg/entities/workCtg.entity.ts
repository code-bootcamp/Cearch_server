import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
