import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from '@app/modules/tag/tag.service';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
