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
import { ApiBearerAuth } from '@nestjs/swagger';
import { ERoles, Page, PageableParams } from '@app/common/types';
import { TagDto } from '@app/modules/tag/dto/tag.dto';
import { ApiOkResponsePaginated } from '@app/common/decorators/api/paged-response.decorator';
import { TagCreateDto } from '@app/modules/tag/dto/tag-create.dto';
import { TagUpdateDto } from '@app/modules/tag/dto/tag-update.dto';
import { Authorization, CognitoUser } from '@nestjs-cognito/auth';
import { CognitoJwtPayload } from '@nestjs-cognito/core';
import { ApiOperationProtected } from '@app/common/api-protected.decorator';

@ApiBearerAuth()
@Controller('tag')
@Authorization({
  allowedGroups: [ERoles.USER],
})
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  @ApiOperationProtected({ summary: 'Create tag' })
  @HttpCode(HttpStatus.CREATED)
  async createTag(
    @CognitoUser() user: CognitoJwtPayload,
    @Body() dto: TagCreateDto,
  ): Promise<void> {
    await this.tagService.createTag(dto, user.sub);
  }

  @Put('update/:tagId')
  @ApiOperationProtected({ summary: 'Update tag' })
  @HttpCode(HttpStatus.OK)
  async updateTag(
    @CognitoUser() user: CognitoJwtPayload,
    @Param('tagId') tagId: string,
    @Body() dto: TagUpdateDto,
  ): Promise<void> {
    await this.tagService.update(tagId, dto, user.sub);
  }

  @Delete('delete/:tagId')
  @ApiOperationProtected({ summary: 'Delete tag' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTag(
    @CognitoUser() user: CognitoJwtPayload,
    @Param('tagId') tagId: string,
  ): Promise<void> {
    await this.tagService.delete(tagId, user.sub);
  }

  @Get()
  @ApiOperationProtected({
    summary: 'Get all tags',
  })
  @ApiOkResponsePaginated(TagDto)
  @HttpCode(HttpStatus.OK)
  async getTags(@Query() pageable: PageableParams): Promise<Page<TagDto>> {
    return this.tagService.getTags(pageable);
  }
}
