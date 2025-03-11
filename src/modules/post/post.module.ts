import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from '@app/modules/post/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { PostEntity } from '@app/common/domain/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, PostEntity])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
