import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { tagEntityToDto } from '@app/modules/tag/mapper/tag.mapper';
import { TagDto } from './dto/tag.dto';
import { Page, PageableParams, UUID } from '@app/common/types/common';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async getTags(pageable: PageableParams): Promise<Page<TagDto>> {
    const size = pageable.size || 20;
    const page = pageable.page || 1;

    const [results, total] = await this.tagRepository.findAndCount({
      order: {
        audit: {
          updatedDate: 'DESC',
        },
      },
    });

    return {
      content: results.map(tagEntityToDto),
      pageable: {
        pageNumber: page,
        pageSize: size,
      },
      totalPages: Math.ceil(total / size),
      totalElements: total,
    };
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
