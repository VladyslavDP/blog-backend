import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { tagEntityToDto } from '@app/modules/tag/mapper/tag.mapper';
import { TagDto } from './dto/tag.dto';
import { Page, PageableParams, UUID } from '@app/common/types';
import { TagCreateDto } from '@app/modules/tag/dto/tag-create.dto';
import { TagUpdateDto } from '@app/modules/tag/dto/tag-update.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  private getTagByIdOrFail(ID: UUID): Promise<TagEntity> {
    return this.tagRepository.findOneOrFail({ where: { id: ID } });
  }

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

  @Transactional()
  async createTag(dto: TagCreateDto, userId: UUID): Promise<TagDto> {
    const { name } = dto;

    const existingTag = await this.tagRepository.findOne({ where: { name } });

    if (existingTag) {
      throw new BadRequestException('A tag with the same name already exists');
    }

    const tag = await this.tagRepository.save({
      name,
      audit: { createdBy: userId, updatedBy: userId },
    });
    return tagEntityToDto(tag);
  }

  @Transactional()
  async update(ID: UUID, dto: TagUpdateDto, userId: UUID): Promise<void> {
    const { name } = dto;

    await this.getTagByIdOrFail(ID);

    await this.tagRepository.update(ID, { name, audit: { updatedBy: userId } });
  }

  @Transactional()
  async delete(ID: UUID, userId: UUID): Promise<void> {
    await this.getTagByIdOrFail(ID);

    await this.tagRepository.update(ID, { audit: { deletedBy: userId } });
    await this.tagRepository.softDelete(ID);
  }
}
