import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FileUploadResolver } from './file.resolver';
import { FileUploadService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    FileUploadResolver, //
    FileUploadService,
  ],
})
export class FileUploadModule {}
