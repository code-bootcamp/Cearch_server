import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLectureRegistrationInput } from './dto/createLectureRegistration.input';
import { UpdateLectureRegistrationInput } from './dto/updateLectureRegistration.input';
import { LectureRegistration } from './entitites/lectureRegistration.entity';

// Interface
interface ICreate {
  createLectureRegistrationInput: CreateLectureRegistrationInput;
}
interface IFindOne {
  lectureRegistrationId: string;
}
interface IUpdate {
  lectureRegistrationId: string;
  updatelectureRegistrationInput: UpdateLectureRegistrationInput;
}
@Injectable()
export class LectureRegistrationService {
  constructor(
    @InjectRepository(LectureRegistration)
    private readonly lectureRegistrationRepository: Repository<LectureRegistration>,
  ) {}

  // Create Registration Form
  async create({}: ICreate) {
    return await this.lectureRegistrationRepository.save;
  }

  // Find All Registration Forms: ReadAll
  async findAll() {
    const result = await this.lectureRegistrationRepository.find({
      relations: ['lectureRegistration'],
    });
    return await result;
  }

  async findOne({ lectureRegistrationId }: IFindOne) {
    return await this.lectureRegistrationRepository.findOne({
      id: lectureRegistrationId,
    });
  }
  // Update Registration Form
  async update({
    lectureRegistrationId,
    updatelectureRegistrationInput,
  }: IUpdate) {
    const currentlectureRegistration =
      await this.lectureRegistrationRepository.findOne({
        id: lectureRegistrationId,
      });
    const newlectureRegistration = {
      ...currentlectureRegistration,
      ...updatelectureRegistrationInput,
    };
    return await this.lectureRegistrationRepository.save(
      newlectureRegistration,
    );
  }

  async delete({ lectureRegistrationId }) {
    const result = await this.lectureRegistrationRepository.softDelete({
      id: lectureRegistrationId,
    });
    return result.affected ? true : false;
  }
}
