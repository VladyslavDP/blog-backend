import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export * from './enums';

export type Nullable<T> = T | null;
export type UUID = string;

class Pageable {
  @ApiProperty({ description: 'Page number' })
  pageNumber: number;
  @ApiProperty({ description: 'Page size' })
  pageSize: number;
}

export class ResponseList<T> {
  @ApiProperty({
    isArray: true,
  })
  list: T[];
}

export class Page<T> {
  content: T[];
  @ApiProperty({ description: 'Pageable params', type: () => Pageable })
  pageable: Pageable;
  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
  @ApiProperty({ description: 'Total elements' })
  totalElements?: number;
}

export class PageableParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ description: 'Page number', required: false, example: 1 })
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ description: 'Page size', required: false, example: 10 })
  size?: number = 10;
}

class Constraint {
  @ApiPropertyOptional({ example: 'Email format is incorrect' })
  @IsOptional()
  @IsString()
  isEmail?: string;

  @ApiPropertyOptional({
    example:
      'Invalid password format. Password minimum length 8 characters and contains at least 1 number, 1 special character, 1 uppercase letter, 1 lowercase letter',
  })
  @IsOptional()
  @IsString()
  matches?: string;
}

class ValidationError {
  @ApiPropertyOptional({ example: 'email' })
  @IsOptional()
  @IsString()
  property?: string;

  @ApiPropertyOptional({ example: 'string' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    example: { email: 'string', password: 'string' },
  })
  @IsOptional()
  target?: Record<string, any>;

  @ApiPropertyOptional({ type: [ValidationError], default: [] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ValidationError)
  children?: ValidationError[];

  @ApiPropertyOptional({ type: Constraint })
  @IsOptional()
  @ValidateNested()
  @Type(() => Constraint)
  constraints?: Constraint;
}

export class ErrorResponse {
  @ApiPropertyOptional({ example: 400, required: false })
  @IsOptional()
  @IsNumber()
  statusCode?: number;

  @ApiProperty({
    type: [ValidationError],
    example: [],
    description: 'An array of validation errors or a string message',
  })
  message?: ValidationError[] | string;

  @ApiPropertyOptional({ example: 'Bad Request' })
  @IsOptional()
  @IsString()
  error?: string;

  @ApiPropertyOptional({ example: 'UnauthorizedException' })
  @IsOptional()
  @IsString()
  name?: string;
}

export type AppMimeType = 'image/png' | 'image/jpeg';

export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer | string;
}

export const adminUUID = '00000000-0000-0000-0000-000000000000';
