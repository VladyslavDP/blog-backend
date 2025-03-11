import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  adminUUID,
  Page,
  PageableParams,
  UUID,
} from '@app/common/types/common';
import { PostService } from '@app/modules/post/post.service';
import { ApiOkResponsePaginated } from '@app/common/decorators/api/paged-response.decorator';
import { PostDto } from '@app/modules/post/dto/post.dto';
import { PostCreateDto } from '@app/modules/post/dto/post-create.dto';
import { PostUpdateDto } from '@app/modules/post/dto/post-update.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new post' })
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() dto: PostCreateDto): Promise<void> {
    await this.postService.createPost(dto, adminUUID);
  }

  @Put('update/:postId')
  @ApiOperation({ summary: 'Update an existing post' })
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @Param('postId') postId: UUID,
    @Body() dto: PostUpdateDto,
  ): Promise<void> {
    await this.postService.updatePost(postId, dto, adminUUID);
  }

  @Delete('delete/:postId')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('postId') postId: UUID): Promise<void> {
    await this.postService.deletePost(postId);
  }

  @Get('get/:postId')
  @ApiOperation({ summary: 'Get a post by ID' })
  @HttpCode(HttpStatus.OK)
  async getPost(@Param('postId') postId: UUID): Promise<PostDto> {
    return this.postService.getPost(postId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiOkResponsePaginated(PostDto)
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() pageable: PageableParams): Promise<Page<PostDto>> {
    return this.postService.getPosts(pageable);
  }
}
