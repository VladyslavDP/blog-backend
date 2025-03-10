import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { TagDto } from '@app/modules/tag/dto/tag.dto';

export function tagEntityToDto(payload: TagEntity): TagDto {
  return {
    id: payload.id,
    name: payload.name,
  };
}
