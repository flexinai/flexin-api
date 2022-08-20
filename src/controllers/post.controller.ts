import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {Post} from '../models';
import {PostRepository} from '../repositories';
import {VideoUploadService} from '../services';
import {UPLOADTYPES} from '../utils/enums';

export class PostController {
  constructor(
    @repository(PostRepository)
    public postRepository: PostRepository,
    @inject('services.VideoUploadService')
    protected videoUploadService: VideoUploadService,
  ) {}

  @post('/posts')
  @response(200, {
    description: 'Post model instance',
    content: {'application/json': {schema: getModelSchemaRef(Post)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {
            title: 'NewPost',
            exclude: ['id'],
          }),
        },
      },
    })
    postEntity: Omit<Post, 'id'>,
  ): Promise<Post> {
    const finishedPost = await this.postRepository.create(postEntity);
    await this.videoUploadService.sendJob(finishedPost, UPLOADTYPES.POST);
    return finishedPost;
  }

  @get('/posts/count')
  @response(200, {
    description: 'Post model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Post) where?: Where<Post>): Promise<Count> {
    return this.postRepository.count(where);
  }

  @get('/posts')
  @response(200, {
    description: 'Array of Post model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Post, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Post) filter?: Filter<Post>): Promise<Post[]> {
    return this.postRepository.find(filter);
  }

  @patch('/posts')
  @response(200, {
    description: 'Post PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    postEntity: Post,
    @param.where(Post) where?: Where<Post>,
  ): Promise<Count> {
    return this.postRepository.updateAll(postEntity, where);
  }

  @get('/posts/{id}')
  @response(200, {
    description: 'Post model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Post, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Post, {exclude: 'where'}) filter?: FilterExcludingWhere<Post>,
  ): Promise<Post> {
    return this.postRepository.findById(id, filter);
  }

  @patch('/posts/{id}')
  @response(204, {
    description: 'Post PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    postEntity: Post,
  ): Promise<void> {
    await this.postRepository.updateById(id, postEntity);
  }

  @put('/posts/{id}')
  @response(204, {
    description: 'Post PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() postEntity: Post): Promise<void> {
    await this.postRepository.replaceById(id, postEntity);
  }

  @del('/posts/{id}')
  @response(204, {
    description: 'Post DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.postRepository.deleteById(id);
  }
}
