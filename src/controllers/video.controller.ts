import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Video} from '../models';
import {VideoRepository} from '../repositories';

export class VideoController {
  constructor(
    @repository(VideoRepository)
    public videoRepository : VideoRepository,
  ) {}

  @post('/videos')
  @response(200, {
    description: 'Video model instance',
    content: {'application/json': {schema: getModelSchemaRef(Video)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {
            title: 'NewVideo',
            exclude: ['id'],
          }),
        },
      },
    })
    video: Omit<Video, 'id'>,
  ): Promise<Video> {
    return this.videoRepository.create(video);
  }

  @get('/videos/count')
  @response(200, {
    description: 'Video model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Video) where?: Where<Video>,
  ): Promise<Count> {
    return this.videoRepository.count(where);
  }

  @get('/videos')
  @response(200, {
    description: 'Array of Video model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Video, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Video) filter?: Filter<Video>,
  ): Promise<Video[]> {
    return this.videoRepository.find(filter);
  }

  @patch('/videos')
  @response(200, {
    description: 'Video PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {partial: true}),
        },
      },
    })
    video: Video,
    @param.where(Video) where?: Where<Video>,
  ): Promise<Count> {
    return this.videoRepository.updateAll(video, where);
  }

  @get('/videos/{id}')
  @response(200, {
    description: 'Video model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Video, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Video, {exclude: 'where'}) filter?: FilterExcludingWhere<Video>
  ): Promise<Video> {
    return this.videoRepository.findById(id, filter);
  }

  @patch('/videos/{id}')
  @response(204, {
    description: 'Video PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {partial: true}),
        },
      },
    })
    video: Video,
  ): Promise<void> {
    await this.videoRepository.updateById(id, video);
  }

  @put('/videos/{id}')
  @response(204, {
    description: 'Video PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() video: Video,
  ): Promise<void> {
    await this.videoRepository.replaceById(id, video);
  }

  @del('/videos/{id}')
  @response(204, {
    description: 'Video DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.videoRepository.deleteById(id);
  }
}
