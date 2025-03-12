import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Audit } from '@app/common/domain/entities/audit.entity';
import { UUID } from '@app/common/types';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
    default: () => 'uuid_generate_v4()',
  })
  id: UUID;

  @Column({
    name: 'nick_name',
    unique: true,
  })
  nickName: string;

  @Column({
    name: 'email',
    unique: true,
  })
  email: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @Column(() => Audit, { prefix: false })
  audit: Audit;
}
