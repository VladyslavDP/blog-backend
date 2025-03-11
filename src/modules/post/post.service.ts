import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Page, PageableParams, UUID } from '@app/common/types/common';
import { PostEntity } from '@app/common/domain/entities/post.entity';
import { PostCreateDto } from '@app/modules/post/dto/post-create.dto';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { PostUpdateDto } from '@app/modules/post/dto/post-update.dto';
import {
  postEntityToDto,
  postEntityToExtendedDto,
} from '@app/modules/post/mapper/post.mapper';
import { PostDto } from '@app/modules/post/dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  private getPostByIdOrFail(ID: UUID): Promise<PostEntity> {
    return this.postRepository.findOneOrFail({
      where: { id: ID },
      relations: ['tags'],
    });
  }

  private async processTags(
    tagNames: string[],
    userId: UUID,
  ): Promise<TagEntity[]> {
    const existingTags = await this.tagRepository.find({
      where: { name: In(tagNames) },
    });

    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tagNames.filter(
      (name) => !existingTagNames.includes(name),
    );

    const newTags = newTagNames.map((name) =>
      this.tagRepository.create({
        name,
        audit: { createdBy: userId, updatedBy: userId },
      }),
    );
    await this.tagRepository.save(newTags);

    return [...existingTags, ...newTags];
  }

  async createPost(dto: PostCreateDto, userId: UUID) {
    const tags = await this.processTags(dto.tags, userId);
    const post = this.postRepository.create({
      title: dto.title,
      slug: dto.slug,
      content: dto.content,
      timeToRead: dto.timeToRead,
      tags,
      audit: {
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.postRepository.save(post);
  }

  async updatePost(ID: UUID, dto: PostUpdateDto, userId: UUID): Promise<void> {
    const { tags, ...rest } = dto;

    const post = await this.getPostByIdOrFail(ID);

    Object.assign(post, rest);

    if (tags) {
      post.tags = await this.processTags(tags, userId);
    }

    post.audit.updatedBy = userId;

    await this.postRepository.save(post);
  }

  async deletePost(ID: UUID) {
    await this.getPostByIdOrFail(ID);
    await this.postRepository.softDelete(ID);
  }

  async getPost(ID: UUID) {
    const post = await this.getPostByIdOrFail(ID);
    return postEntityToExtendedDto(post);
  }

  async getPosts(pageable: PageableParams): Promise<Page<PostDto>> {
    const size = pageable.size || 20;
    const page = pageable.page || 1;

    const [results, total] = await this.postRepository.findAndCount({
      order: {
        audit: {
          updatedDate: 'DESC',
        },
      },
    });

    return {
      content: results.map(postEntityToDto),
      pageable: {
        pageNumber: page,
        pageSize: size,
      },
      totalPages: Math.ceil(total / size),
      totalElements: total,
    };
  }
}
