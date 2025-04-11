import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { Express, Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { EFileType, UUID } from '@app/common/types';
import { generateFilePipe } from '@app/common/utils';
import * as mime from 'mime-types';
import { UploadFileDto } from '@app/modules/storage/dto/upload-file.dto';
import { UploadFileResponseDto } from '@app/modules/storage/dto/upload-file-response.dto';
import { ApiOperationProtected } from '@app/common/api-protected.decorator';
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model';
import { Authorization, CognitoUser } from '@nestjs-cognito/auth';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload/file-stream')
  @ApiOperationProtected({ summary: 'Upload a file' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileDto,
  })
  @Authorization({
    allowedGroups: ['user'],
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UploadFileResponseDto,
  })
  async uploadStream(
    @CognitoUser() user: CognitoJwtPayload,
    @UploadedFile(
      generateFilePipe(1, [
        EFileType.JPG,
        EFileType.JPEG,
        EFileType.PNG,
        EFileType.PDF,
      ]),
    )
    file: Express.Multer.File,
    @Body() dto: Omit<UploadFileDto, 'file'>,
  ): Promise<UploadFileResponseDto> {
    const fileType = mime.extension(file.mimetype) as EFileType;

    const aliasOrName = await this.storageService.uploadFile(
      user,
      dto.bucket,
      dto.alias || file.originalname,
      file.buffer,
      fileType,
    );

    return { aliasOrName };
  }

  @Get('static/:aliasOrName')
  async getFile(
    @Param('aliasOrName') aliasOrName: string,
    @Res() res: Response,
  ) {
    const fileStream = await this.storageService.getFile(aliasOrName);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${aliasOrName}"`,
    });

    fileStream.pipe(res);
  }

  @Delete('static/:aliasOrName')
  @ApiOperationProtected({ summary: 'Delete file' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Authorization({
    allowedGroups: ['user'],
  })
  async deletePost(
    @CognitoUser() user: CognitoJwtPayload,
    @Param('aliasOrName') aliasOrName: UUID,
  ): Promise<void> {
    await this.storageService.deleteFile(user, aliasOrName);
  }
}
