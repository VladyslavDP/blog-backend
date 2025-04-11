import { ApiProperty } from '@nestjs/swagger';
import { EBucket } from '@app/common/types';

export class UploadFileDto {
  @ApiProperty({ enum: EBucket, required: true })
  bucket: EBucket;

  @ApiProperty({ required: false })
  alias: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: File;
}
