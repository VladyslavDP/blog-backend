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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Page, PageableParams, UUID } from '@app/common/types';
import { PostService } from '@app/modules/post/post.service';
import { ApiOkResponsePaginated } from '@app/common/decorators/api/paged-response.decorator';
import { PostDto } from '@app/modules/post/dto/post.dto';
import { PostCreateDto } from '@app/modules/post/dto/post-create.dto';
import { PostUpdateDto } from '@app/modules/post/dto/post-update.dto';
import { Authorization, CognitoUser } from '@nestjs-cognito/auth';
import { CognitoJwtPayload } from '@nestjs-cognito/core';
import { ApiOperationProtected } from '@app/common/api-protected.decorator';

@ApiBearerAuth()
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @ApiOperationProtected({ summary: 'Create a new post' })
  @HttpCode(HttpStatus.CREATED)
  @Authorization({
    allowedGroups: ['user'],
  })
  async createPost(
    @CognitoUser() user: CognitoJwtPayload,
    @Body() dto: PostCreateDto,
  ): Promise<void> {
    await this.postService.createPost(dto, user.sub);
  }

  @Put('update/:postId')
  @ApiOperationProtected({ summary: 'Update an existing post' })
  @HttpCode(HttpStatus.OK)
  @Authorization({
    allowedGroups: ['user'],
  })
  async updatePost(
    @CognitoUser() user: CognitoJwtPayload,
    @Param('postId') postId: UUID,
    @Body() dto: PostUpdateDto,
  ): Promise<void> {
    await this.postService.updatePost(postId, dto, user.sub);
  }

  @Delete('delete/:postId')
  @ApiOperationProtected({ summary: 'Delete a post by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Authorization({
    allowedGroups: ['user'],
  })
  async deletePost(
    @CognitoUser() user: CognitoJwtPayload,
    @Param('postId') postId: UUID,
  ): Promise<void> {
    await this.postService.deletePost(postId, user.sub);
  }

  @Get('get/:slug')
  @ApiOperation({ summary: 'Get a post by slug' })
  @HttpCode(HttpStatus.OK)
  async getPost(@Param('slug') slug: string): Promise<PostDto> {
    return this.postService.getPost(slug);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiOkResponsePaginated(PostDto)
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() pageable: PageableParams): Promise<Page<PostDto>> {
    return this.postService.getPosts(pageable);
  }
}
