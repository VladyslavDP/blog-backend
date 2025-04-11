import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from '@app/modules/storage/storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageEntity } from '@app/common/domain/entities/storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StorageEntity])],
  controllers: [StorageController],
  exports: [StorageService],
  providers: [StorageService],
})
export class StorageModule {}
