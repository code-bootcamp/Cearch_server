import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { getConnection, Repository } from 'typeorm';
import { IcurrentUser } from '../auth/auth.resolver';
import { LectureImage } from '../LectureImage/entities/lectureImage.entity';
import { LectureProduct } from '../lectureProduct/entities/lectureProduct.entity';
import { PostImage } from '../postImage/entities/postImage.entity';
import { QtBoard } from '../QtBoard/entities/qt.entity';
import { User } from '../user/entities/user.entity';

export enum URL_PURPOSE {
  LECTURE = 'LECTURE',
  USER = 'USER',
  QTBOARD = 'QTBOARD',
}

interface IfileInfo {
  fileNames: string[];
  id: string;
  purpose: URL_PURPOSE;
}

interface IfileToDbUser {
  filePaths: string[];
  user: IcurrentUser;
}

interface IfileToDbLecture {
  filePaths: string[];
  lectureId: string;
}

interface IfileToDbQt {
  filePaths: string[];
  qTId: string;
}
const s3 = new AWS.S3({
  accessKeyId: 'AKIAXWQK6LR2PAYBMZYM',
  secretAccessKey: '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',
  region: 'ap-northeast-2',
  signatureVersion: 'v4',
});

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //
    @InjectRepository(LectureImage)
    private readonly lectureImgRepository: Repository<LectureImage>,
    @InjectRepository(LectureProduct)
    private readonly lectureProductRepository: Repository<LectureProduct>,
    @InjectRepository(QtBoard)
    private readonly qTBoardRepository: Repository<QtBoard>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async putSignedUrl({ fileNames, id, purpose }: IfileInfo) {
    const fileNamesList = fileNames.map((ele) =>
      s3.getSignedUrlPromise('putObject', {
        Bucket: 'cearchtest',
        Expires: 120,
        Key: `${purpose}/${id}/${ele}`,
      }),
    );
    const result = await Promise.all(fileNamesList);

    console.log('urls : ', result);
    return result;
  }

  async urlToDbUser({ filePaths, user }: IfileToDbUser) {
    const userFind = await this.userRepository.findOne({
      where: { id: user.id },
    });
    const imageUrlList = filePaths.map((filePath) =>
      this.userRepository.save({
        ...userFind,
        imageUrl: filePath,
      }),
    );
    const result = await Promise.all(imageUrlList);
    return result;
  }

  async getSignedUrlUser({ user }) {
    const userFinds = await this.userRepository.find({
      where: { id: user.id },
    });
    const fileNamesList = userFinds.map((user) =>
      s3.getSignedUrlPromise('getObject', {
        Bucket: 'cearchtest',
        Expires: 120,
        Key: user.imageUrl, //img url 추후 문자열처리를 해주어야한다. 우선적으로 진행
      }),
    );
    const urls = await Promise.all(fileNamesList);
    console.log('urls : ', urls);
    return urls;
  }
  ////////////////////////
  async getSignedUrlLecture({ lectureId }) {
    const urlList = await getConnection()
      .createQueryBuilder()
      .select('lecture_image')
      .from(LectureImage, 'lecture_image')
      .where('lecture_image.product = :id', { id: lectureId })
      .getMany();

    console.log('querybuilder : ', urlList);

    const fileNamesList = urlList.map((lecture) =>
      s3.getSignedUrlPromise('getObject', {
        Bucket: 'cearchtest',
        Expires: 120,
        Key: lecture.url, //img url 추후 문자열처리를 해주어야한다. 우선적으로 진행
      }),
    );
    const urls = await Promise.all(fileNamesList);
    return urls;
  }

  async urlToDbLecture({ filePaths, lectureId }: IfileToDbLecture) {
    const lectureFind = await this.lectureProductRepository.findOne({
      where: { id: lectureId },
    });
    const imageUrlList = filePaths.map((filePath) =>
      this.lectureImgRepository.save({
        url: filePath,
        product: lectureFind,
      }),
    );
    const result = await Promise.all(imageUrlList);
    return result;
  }
  ////////////////////////////
  async getSignedUrlQt({ qTId }) {
    const urlList = await getConnection()
      .createQueryBuilder()
      .select('post_image')
      .from(PostImage, 'post_image')
      .where('post_image.qtBoard = :id', { id: qTId })
      .getMany();

    console.log('querybuilder : ', urlList);

    const fileNamesList = urlList.map((qT) =>
      s3.getSignedUrlPromise('getObject', {
        Bucket: 'cearchtest',
        Expires: 120,
        Key: qT.url, //img url 추후 문자열처리를 해주어야한다. 우선적으로 진행
      }),
    );
    const urls = await Promise.all(fileNamesList);
    return urls;
  }

  async urlToDbQt({ filePaths, qTId }: IfileToDbQt) {
    const qTBoardFind = await this.qTBoardRepository.findOne({
      where: { id: qTId },
    });
    const imageUrlList = filePaths.map((filePath) =>
      this.postImageRepository.save({
        url: filePath,
        qtBoard: qTBoardFind,
      }),
    );
    const result = await Promise.all(imageUrlList);
    return result;
  }
  //////////////////////////////////////////////////
}
