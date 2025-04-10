import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsArray,
  ArrayMinSize,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class PostUpdateDto {
  @ApiProperty({
    example: 'Updated Post Title',
    description: 'The updated title of the post',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    example: 'updated-post-slug',
    description: 'The updated slug for the post',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  slug?: string;

  @ApiProperty({
    example: 'Updated content for the post',
    description: 'The updated main content of the post',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @ApiProperty({
    type: [String],
    example: ['new-tag', 'updated-tag'],
    description: 'Updated array of tag names (strings)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  tags?: string[];

  @ApiProperty({
    example: 10,
    description: 'Updated time to read the post, in minutes',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeToRead?: number;

  @ApiProperty({
    example: 'The content description of the post',
    description: 'The content description of the post',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(255)
  description: string;
}
