import { Repository } from 'typeorm';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { TagService } from '../src/modules/tag/tag.service';
import { TagCreateDto } from '@app/modules/tag/dto/tag-create.dto';
import { TagUpdateDto } from '@app/modules/tag/dto/tag-update.dto';
import { PageableParams, UUID } from '@app/common/types/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.setTimeout(300000);

describe('TagService (e2e)', () => {
  let app: INestApplication;

  let tagService: TagService;
  let repository: Repository<TagEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    app = moduleFixture.createNestApplication();

    repository = app.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity),
    ) as Repository<TagEntity>;

    tagService = app.select(AppModule).get(TagService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should perform CRUD operations in order', async () => {
    const createDto: TagCreateDto = { name: 'TestTag' };
    const userId: UUID = '00000000-0000-0000-0000-000000000000' as UUID;

    const createdTag = await tagService.createTag(createDto, userId);

    expect(createdTag).toBeDefined();
    expect(createdTag.id).toBeDefined();
    expect(createdTag.name).toBe('TestTag');

    const updateDto: TagUpdateDto = { name: 'UpdatedTag' };
    await tagService.update(createdTag.id, updateDto, userId);

    const updatedTag = await repository.findOneOrFail({
      where: { id: createdTag.id },
    });

    expect(updatedTag.name).toBe('UpdatedTag');
    expect(updatedTag.audit.updatedBy).toBe(userId);

    const pageable: PageableParams = { page: 1, size: 10 };

    const tags = await tagService.getTags(pageable);

    expect(tags.content.length).toBe(1);
    expect(tags.content[0].id).toBe(createdTag.id);
    expect(tags.content[0].name).toBe('UpdatedTag');

    await tagService.delete(createdTag.id, userId);

    const deletedTag = await repository.findOne({
      where: { id: createdTag.id },
    });

    expect(deletedTag).toBeNull();
  });
});
