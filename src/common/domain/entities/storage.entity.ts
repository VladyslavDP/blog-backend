import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Audit } from '@app/common/domain/entities/audit.entity';
import { EBucket, EFileType, UUID } from '@app/common/types';

@Entity('storage')
export class StorageEntity extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
    default: () => 'uuid_generate_v4()',
  })
  id: UUID;

  @Column({
    name: 'original_name',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  originalName: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  alias: string;

  @Column({
    name: 'file_type',
    type: 'enum',
    enum: EFileType,
    nullable: false,
  })
  fileType: EFileType;

  @Column({
    name: 'bucket',
    type: 'enum',
    enum: EBucket,
    nullable: false,
  })
  bucket: EBucket;

  @Column(() => Audit, { prefix: false })
  audit: Audit;
}
