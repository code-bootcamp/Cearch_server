import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureImage } from '../LectureImage/entities/lectureImage.entity';
import { LectureProduct } from '../lectureProduct/entities/lectureProduct.entity';
import { LectureProductCategory } from '../lectureproductCategory/entities/lectureproductCategory.entity';
import { PostImage } from '../postImage/entities/postImage.entity';
import { QtBoard } from '../QtBoard/entities/qt.entity';
import { User } from '../user/entities/user.entity';
import { FileUploadResolver } from './file.resolver';
import { FileUploadService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      LectureImage, //
      LectureProduct,
      LectureProductCategory,
      PostImage,
      QtBoard,
    ]),
  ],
  providers: [
    FileUploadResolver, //
    FileUploadService,
  ],
})
export class FileUploadModule {}
