import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Likes } from './entities/likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,

    private readonly connection: Connection,
  ) {}
}
