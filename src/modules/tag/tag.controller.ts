import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TagService } from '@app/modules/tag/tag.service';
import { ApiOperation } from '@nestjs/swagger';
import { Page, PageableParams } from '@app/common/types/common';
import { TagDto } from '@app/modules/tag/dto/tag.dto';
import { ApiOkResponsePaginated } from '@app/common/decorators/api/paged-response.decorator';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

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
