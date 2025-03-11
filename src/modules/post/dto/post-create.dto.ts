import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class PostCreateDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'my-first-post',
    description: 'The slug for the post',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  slug: string;

  @ApiProperty({
    example: 'This is the content of the post.',
    description: 'The main content of the post',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({
    type: [String],
    example: ['nestjs', 'backend', 'javascript'],
    description: 'Array of tag names (strings)',
  })
  @IsArray()
  @ArrayMinSize(1)
  tags: string[];

  @ApiProperty({ example: 5, description: 'Time to read the post, in minutes' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  timeToRead: number;
}
