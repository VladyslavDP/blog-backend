import { Repository } from 'typeorm';
import { PostEntity } from '@app/common/domain/entities/post.entity';
import { PostService } from '../src/modules/post/post.service';
import { PostCreateDto } from '@app/modules/post/dto/post-create.dto';
import { PostUpdateDto } from '@app/modules/post/dto/post-update.dto';
import { TagEntity } from '@app/common/domain/entities/tag.entity';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UUID, PageableParams } from '@app/common/types/common';

jest.setTimeout(300000);

describe('PostService (e2e)', () => {
  let app: INestApplication;
  let postService: PostService;
  let postRepository: Repository<PostEntity>;
  let tagRepository: Repository<TagEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    app = moduleFixture.createNestApplication();

    postRepository = app.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity),
    ) as Repository<PostEntity>;

    tagRepository = app.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity),
    ) as Repository<TagEntity>;

    postService = app.select(AppModule).get(PostService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should perform CRUD operations in order', async () => {
    const userId: UUID = '00000000-0000-0000-0000-000000000000' as UUID;

    // Create step
    const createDto: PostCreateDto = {
      title: 'Test Post',
      slug: 'test-post',
      content: 'This is a test post content',
      tags: ['nestjs', 'typescript'],
      timeToRead: 5,
    };

    await postService.createPost(createDto, userId);

    // Explicitly include relations when fetching posts
    const posts = await postRepository.find({
      relations: ['tags'],
    });
    expect(posts.length).toBe(1);

    const createdPost = posts[0];
    expect(createdPost.title).toBe(createDto.title);
    expect(createdPost.slug).toBe(createDto.slug);
    expect(createdPost.tags).toBeDefined();
    expect(createdPost.tags.length).toBe(2);
    expect(createdPost.tags.map((tag) => tag.name)).toEqual(
      expect.arrayContaining(createDto.tags),
    );
    expect(createdPost.audit.createdBy).toBe(userId);

    // Update step
    const updateDto: PostUpdateDto = {
      title: 'Updated Post Title',
      tags: ['nestjs', 'backend'],
      timeToRead: 10,
    };

    await postService.updatePost(createdPost.id, updateDto, userId);

    const updatedPost = await postRepository.findOneOrFail({
      where: { id: createdPost.id },
      relations: ['tags'],
    });

    expect(updatedPost.title).toBe(updateDto.title);
    expect(updatedPost.tags.length).toBe(2);
    expect(updatedPost.tags.map((tag) => tag.name)).toEqual(
      expect.arrayContaining(updateDto.tags),
    );
    expect(updatedPost.timeToRead).toBe(updateDto.timeToRead);
    expect(updatedPost.audit.updatedBy).toBe(userId);

    // Get post
    const postDto = await postService.getPost(updatedPost.slug);

    expect(postDto.id).toBe(updatedPost.id);
    expect(postDto.title).toBe(updatedPost.title);
    expect(postDto.tags).toEqual(expect.arrayContaining(updateDto.tags));
    expect(postDto.timeToRead).toBe(updateDto.timeToRead);

    // Paginate step
    const pageable: PageableParams = { page: 1, size: 10 };

    const paginatedResult = await postService.getPosts(pageable);

    expect(paginatedResult.content.length).toBe(1);
    expect(paginatedResult.content[0].id).toBe(updatedPost.id);

    // Delete step
    await postService.deletePost(updatedPost.id, userId);

    const deletedPost = await postRepository.findOne({
      where: { id: updatedPost.id },
    });

    expect(deletedPost).toBeNull();
  });
});
