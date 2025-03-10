import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { tagEntityToDto } from '@app/modules/tag/mapper/tag.mapper';
import { TagDto } from './dto/tag.dto';
import { UUID } from '@app/common/types/common';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async getTags(): Promise<TagDto[]> {
    const tags = await this.tagRepository.find();
    return tags.map(tagEntityToDto);
  }

  async createTag(name: string, userId: UUID): Promise<TagDto> {
    const tag = await this.tagRepository.save({ name, userId });
    return tagEntityToDto(tag);
  }

  async update(ID: UUID, name: string, userId: UUID): Promise<void> {
    await this.tagRepository.update(ID, { name, audit: { updatedBy: userId } });
  }

  async delete(ID: UUID): Promise<void> {
    await this.tagRepository.softDelete(ID);
  }
}
