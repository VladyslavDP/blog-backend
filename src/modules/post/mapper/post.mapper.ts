import { PostEntity } from '@app/common/domain/entities/post.entity';
import { PostDto, PostExtendedDto } from '@app/modules/post/dto/post.dto';

export function postEntityToDto(payload: PostEntity): PostDto {
  return {
    id: payload.id,
    title: payload.title,
    description: payload.description,
    slug: payload.slug,
    tags: payload.tags?.map((tag) => tag.name),
    timeToRead: payload.timeToRead,
    createdAt: payload.audit?.createdDate?.toLocaleString(),
    updatedAt: payload.audit?.updatedDate?.toLocaleString(),
  };
}

export function postEntityToExtendedDto(payload: PostEntity): PostExtendedDto {
  return {
    ...postEntityToDto(payload),
    content: payload.content,
  };
}
