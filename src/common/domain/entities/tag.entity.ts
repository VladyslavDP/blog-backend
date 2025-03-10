import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Audit } from '@app/common/domain/entities/audit.entity';
import { UUID } from '@app/common/types/common';
import { PostEntity } from '@app/common/domain/entities/post.entity';

@Entity('tags')
export class TagEntity extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
    default: () => 'uuid_generate_v4()',
  })
  id: UUID;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column(() => Audit, { prefix: false })
  audit: Audit;

  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts: PostEntity[];
}
