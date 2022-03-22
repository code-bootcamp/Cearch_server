import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

interface IfileInfo {
  fileNames: string[];
  userId: string;
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
  ) {}

  async putSignedUrl({ fileNames, userId }: IfileInfo) {
    const fileNamesList = fileNames.map((ele) =>
      s3.getSignedUrlPromise('putObject', {
        Bucket: 'cearchtest',
        Expires: 120,
        Key: `${userId}/${ele}`,
      }),
    );
    const result = await Promise.all(fileNamesList);

    console.log('urls : ', result);
    return result;
  }

  async urlToDb({ filePath, user }) {
    const userFind = await this.userRepository.findOne({
      where: { id: user.id },
    });
    const result = await this.userRepository.save({
      ...userFind,
      imageUrl: filePath,
    });
    return result;
  }

  async getSignedUrl({ user }) {
    const userFind = await this.userRepository.findOne({
      where: { id: user.id },
    });
    const url = await s3.getSignedUrlPromise('getObject', {
      Bucket: 'cearchtest',
      Expires: 120,
      Key: userFind.imageUrl,
    });
    console.log('url : ', url);
    return url;
  }
}
