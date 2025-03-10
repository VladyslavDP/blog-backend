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
import { ApiOperation } from '@nestjs/swagger';
import { adminUUID, Page, PageableParams } from '@app/common/types/common';
import { TagDto } from '@app/modules/tag/dto/tag.dto';
import { ApiOkResponsePaginated } from '@app/common/decorators/api/paged-response.decorator';
import { TagCreateDto } from '@app/modules/tag/dto/tag-create.dto';
import { TagUpdateDto } from '@app/modules/tag/dto/tag-update.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create tag' })
  async createTag(@Body() dto: TagCreateDto): Promise<void> {
    await this.tagService.createTag(dto, adminUUID);
  }

  @Put('update/:tagId')
  @ApiOperation({ summary: 'Update tag' })
  async updateTag(
    @Param('tagId') tagId: string,
    @Body() dto: TagUpdateDto,
  ): Promise<void> {
    await this.tagService.update(tagId, dto, adminUUID);
  }

  @Delete('delete/:tagId')
  @ApiOperation({ summary: 'Delete tag' })
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
