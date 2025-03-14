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
import { TagService } from '@app/modules/tag/tag.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Page, PageableParams } from '@app/common/types';
import { TagDto } from '@app/modules/tag/dto/tag.dto';
import { ApiOkResponsePaginated } from '@app/common/decorators/api/paged-response.decorator';
import { TagCreateDto } from '@app/modules/tag/dto/tag-create.dto';
import { TagUpdateDto } from '@app/modules/tag/dto/tag-update.dto';
import { Authorization, CognitoUser } from '@nestjs-cognito/auth';
import { CognitoJwtPayload } from '@nestjs-cognito/core';

@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create tag' })
  @HttpCode(HttpStatus.CREATED)
  @Authorization({
    allowedGroups: ['user'],
  })
  async createTag(
    @CognitoUser() user: CognitoJwtPayload,
    @Body() dto: TagCreateDto,
  ): Promise<void> {
    await this.tagService.createTag(dto, user.sub);
  }

  @Put('update/:tagId')
  @ApiOperation({ summary: 'Update tag' })
  @HttpCode(HttpStatus.OK)
  @Authorization({
    allowedGroups: ['user'],
  })
  async updateTag(
    @CognitoUser() user: CognitoJwtPayload,
    @Param('tagId') tagId: string,
    @Body() dto: TagUpdateDto,
  ): Promise<void> {
    await this.tagService.update(tagId, dto, user.sub);
  }

  @Delete('delete/:tagId')
  @ApiOperation({ summary: 'Delete tag' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTag(@Param('tagId') tagId: string): Promise<void> {
    await this.tagService.delete(tagId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tags',
  })
  @ApiOkResponsePaginated(TagDto)
  @HttpCode(HttpStatus.OK)
  async getTags(@Query() pageable: PageableParams): Promise<Page<TagDto>> {
    return this.tagService.getTags(pageable);
  }
}
