import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Readable } from 'node:stream';
import { Transactional } from 'typeorm-transactional';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageEntity } from '@app/common/domain/entities/storage.entity';
import { EBucket, EFileType } from '@app/common/types';
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model';

AWS.config.update({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

@Injectable()
export class StorageService {
  private s3Service: AWS.S3;

  constructor(
    @InjectRepository(StorageEntity)
    private readonly storageRepository: Repository<StorageEntity>,
  ) {
    this.s3Service = new AWS.S3();
  }

  private findFileByAliasOrName(aliasOrName: string) {
    const file = this.storageRepository.findOne({
      where: [
        {
          originalName: aliasOrName,
        },
        {
          alias: aliasOrName,
        },
      ],
    });

    return file;
  }

  async uploadFileStream(
    bucket: string,
    key: string,
    body: Readable | Buffer | string,
  ): Promise<string> {
    try {
      const result = await this.s3Service
        .upload({
          Bucket: bucket, // Имя бакета
          Key: key, // Имя файла в бакете
          Body: body, // Поток или контент
        })
        .promise();

      return result.Location;
    } catch (error) {
      throw new Error(`Ошибка загрузки потока в S3`);
    }
  }

  async getFileStream(bucket: string, key: string): Promise<Readable> {
    try {
      return this.s3Service
        .getObject({
          Bucket: bucket,
          Key: key,
        })
        .createReadStream();
    } catch (error) {
      throw new Error(`Ошибка получения файла из S3`);
    }
  }

  @Transactional()
  async uploadFile(
    user: CognitoJwtPayload,
    bucket: EBucket,
    aliasOrName: string,
    body: Readable | Buffer | string,
    fileType: EFileType,
  ) {
    let file = await this.findFileByAliasOrName(aliasOrName);

    if (file) {
      throw new BadRequestException('File already exist');
    }

    await this.storageRepository.save({
      originalName: aliasOrName,
      fileType,
      bucket,
      audit: {
        createdBy: user.sub,
        createdDate: new Date(),
      },
    });

    file = await this.findFileByAliasOrName(aliasOrName);

    await this.uploadFileStream(bucket, file.id, body);

    return aliasOrName;
  }

  async getFile(aliasOrName: string): Promise<Readable> {
    const file = await this.findFileByAliasOrName(aliasOrName);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return this.getFileStream(file.bucket, file.id);
  }

  @Transactional()
  async deleteFile(user: CognitoJwtPayload, aliasOrName: string) {
    const file = await this.findFileByAliasOrName(aliasOrName);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.storageRepository.update(file.id, {
      audit: { deletedDate: new Date(), deletedBy: user.sub },
    });

    await this.storageRepository.softDelete(file.id);

    this.s3Service.deleteObject({
      Bucket: file.bucket,
      Key: file.id,
    });
  }
}
