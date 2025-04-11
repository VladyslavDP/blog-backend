import { EFileType } from '../types';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export * from './const';

export const generateFilePipe = (
  FILE_LIMIT_SIZE_MB: number,
  FILE_TYPES: EFileType[],
) => {
  let fileType = '.(';

  FILE_TYPES.forEach((type, index) => {
    fileType += type;
    if (FILE_TYPES.length - 1 === index) {
      fileType += ')';
    } else {
      fileType += '|';
    }
  });

  return new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType }),
      new MaxFileSizeValidator({ maxSize: FILE_LIMIT_SIZE_MB * 1024 * 1024 }),
    ],
  });
};
