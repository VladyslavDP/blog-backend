import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TagService } from '@app/modules/tag/tag.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/tags')
  @ApiOperation({
    summary: 'Get all tags',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getTags() {
    return this.tagService.getTags();
  }
}
