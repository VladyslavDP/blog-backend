import { Test, TestingModule } from '@nestjs/testing';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UUID } from '@app/common/types/common';
import { TagService } from '../src/modules/tag/tag.service';

jest.setTimeout(30000);

describe('TagService', () => {
  let service: TagService;
  let tagRepository: Repository<TagEntity>;

  const mockTagRepository = {
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockTagEntity = {
    id: 'example-uuid' as UUID,
    name: 'TestTag',
    audit: {
      createdBy: 'user-id' as UUID,
      createdDate: new Date(),
      updatedBy: null,
      updatedDate: null,
      deletedBy: null,
      deletedDate: null,
    },
  } as TagEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(TagEntity),
          useValue: mockTagRepository,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(tagRepository).toBeDefined();
  });

  describe('getTags', () => {
    it('should return a list of tags', async () => {
      const mockTags = [
        Object.assign(new TagEntity(), {
          id: 'example-uuid',
          name: 'TestTag',
          audit: {
            createdBy: 'user-id',
            createdDate: new Date(),
            updatedBy: null,
            updatedDate: null,
            deletedBy: null,
            deletedDate: null,
          },
        }),
        Object.assign(new TagEntity(), {
          id: 'another-uuid',
          name: 'AnotherTag',
          audit: {
            createdBy: 'user-id',
            createdDate: new Date(),
            updatedBy: null,
            updatedDate: null,
            deletedBy: null,
            deletedDate: null,
          },
        }),
      ];

      jest.spyOn(tagRepository, 'find').mockResolvedValue(mockTags);

      const result = await service.getTags();

      expect(tagRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(
        mockTags.map((tag) => ({ id: tag.id, name: tag.name })),
      );
    });
  });

  describe('createTag', () => {
    it('should create and return a tag', async () => {
      const dto = {
        name: mockTagEntity.name,
        userId: mockTagEntity.audit.createdBy,
      };
      jest.spyOn(tagRepository, 'save').mockResolvedValue(mockTagEntity);

      const result = await service.createTag(dto.name, dto.userId);

      expect(tagRepository.save).toHaveBeenCalledWith({
        name: dto.name,
        userId: dto.userId,
      });
      expect(result).toEqual({
        id: mockTagEntity.id,
        name: mockTagEntity.name,
      });
    });
  });

  describe('update', () => {
    it('should call the repository with correct arguments', async () => {
      const updatedName = 'UpdatedName';
      const updatedBy = 'updated-user-id' as UUID;

      await service.update(mockTagEntity.id, updatedName, updatedBy);

      expect(tagRepository.update).toHaveBeenCalledWith(mockTagEntity.id, {
        name: updatedName,
        audit: {
          updatedBy: updatedBy,
        },
      });
    });
  });

  describe('delete', () => {
    it('should call softDelete with correct ID', async () => {
      await service.delete(mockTagEntity.id);

      expect(tagRepository.softDelete).toHaveBeenCalledWith(mockTagEntity.id);
    });
  });
});
