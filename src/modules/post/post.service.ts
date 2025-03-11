import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UUID } from '@app/common/types/common';
import { PostEntity } from '@app/common/domain/entities/post.entity';
import { PostCreateDto } from '@app/modules/post/dto/post-create.dto';
import { TagEntity } from '@app/common/domain/entities/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  private getPostByIdOrFail(ID: UUID): Promise<PostEntity> {
    return this.postRepository.findOneOrFail({ where: { id: ID } });
  }

  private async processTags(tagNames: string[]): Promise<TagEntity[]> {
    const existingTags = await this.tagRepository.find({
      where: { name: In(tagNames) },
    });

    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tagNames.filter(
      (name) => !existingTagNames.includes(name),
    );

    const newTags = newTagNames.map((name) =>
      this.tagRepository.create({ name }),
    );
    await this.tagRepository.save(newTags);

    return [...existingTags, ...newTags];
  }

  async createPost(dto: PostCreateDto, userId: UUID): Promise<PostEntity> {
    const tags = await this.processTags(dto.tags);
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

    return this.postRepository.save(post);
  }

  async updatePost(ID: UUID, dto: any, userId: UUID) {
    console.log('updatePost');
  }

  async deletePost(ID: UUID) {
    await this.getPostByIdOrFail(ID);
    await this.postRepository.softDelete(ID);
  }

  async getPost(ID: UUID) {
    const post = await this.getPostByIdOrFail(ID);
    return post;
  }

  async getPosts() {
    console.log('getPosts');
  }
}
