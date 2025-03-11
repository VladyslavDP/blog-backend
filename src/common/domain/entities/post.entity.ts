import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { Audit } from '@app/common/domain/entities/audit.entity';
import { UUID } from '@app/common/types/common';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
    default: () => 'uuid_generate_v4()',
  })
  id: UUID;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToMany(() => TagEntity, (tag) => tag.posts, { cascade: true })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];

  @Column({ name: 'time_to_read', type: 'smallint', nullable: false })
  timeToRead: number;

  @Column(() => Audit, { prefix: false })
  audit: Audit;
}
