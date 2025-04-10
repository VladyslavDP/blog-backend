import { ApiProperty } from '@nestjs/swagger';
import { UUID } from '@app/common/types';

export class PostDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the post',
  })
  id: UUID;

  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  title: string;

  @ApiProperty({
    example: 'my-first-post',
    description: 'The slug for the post',
  })
  slug: string;

  @ApiProperty({
    type: [String],
    example: ['nestjs', 'backend', 'javascript'],
    description: 'Array of tag names associated with the post',
  })
  tags: string[];

  @ApiProperty({
    example: 5,
    description: 'Time to read the post, in minutes',
  })
  timeToRead: number;

  @ApiProperty({
    example: '2023-08-20T14:20:00Z',
    description: 'The creation timestamp of the post',
  })
  createdAt: string;

  @ApiProperty({
    example: '2023-08-21T09:15:00Z',
    description: 'The last update timestamp of the post',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Description of the post',
  })
  description: string;
}

export class PostExtendedDto extends PostDto {
  @ApiProperty({
    example: 'This is the content of the post.',
    description: 'The main content of the post',
  })
  content: string;
}
