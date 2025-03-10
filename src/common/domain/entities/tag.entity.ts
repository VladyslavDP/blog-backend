import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Audit } from '@app/common/domain/entities/audit.entity';
import { UUID } from '@app/common/types/common';

@Entity('tags')
export class TagEntity extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: UUID;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column(() => Audit, { prefix: false })
  audit: Audit;
}
