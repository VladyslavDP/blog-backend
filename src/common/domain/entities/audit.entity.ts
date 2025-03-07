import { UUID } from '@app/common/types/common';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Audit {
  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @Column({ name: 'created_by', nullable: false })
  createdBy: UUID;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  @Column({ nullable: true, name: 'updated_by' })
  updatedBy: UUID;

  @DeleteDateColumn({ name: 'deleted_date' })
  deletedDate: Date;

  @Column({ nullable: true, name: 'deleted_by' })
  deletedBy: UUID;
}
