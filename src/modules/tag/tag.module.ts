import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from '@app/modules/tag/tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
