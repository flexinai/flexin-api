import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Video,
  Clip,
} from '../models';
import {VideoRepository} from '../repositories';

export class VideoClipController {
  constructor(
    @repository(VideoRepository) protected videoRepository: VideoRepository,
  ) { }

  @get('/videos/{id}/clips', {
    responses: {
      '200': {
        description: 'Array of Video has many Clip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Clip)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Clip>,
  ): Promise<Clip[]> {
    return this.videoRepository.clips(id).find(filter);
  }

  @post('/videos/{id}/clips', {
    responses: {
      '200': {
        description: 'Video model instance',
        content: {'application/json': {schema: getModelSchemaRef(Clip)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Video.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {
            title: 'NewClipInVideo',
            exclude: ['id'],
            optional: ['videoId']
          }),
        },
      },
    }) clip: Omit<Clip, 'id'>,
  ): Promise<Clip> {
    return this.videoRepository.clips(id).create(clip);
  }

  @patch('/videos/{id}/clips', {
    responses: {
      '200': {
        description: 'Video.Clip PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {partial: true}),
        },
      },
    })
    clip: Partial<Clip>,
    @param.query.object('where', getWhereSchemaFor(Clip)) where?: Where<Clip>,
  ): Promise<Count> {
    return this.videoRepository.clips(id).patch(clip, where);
  }

  @del('/videos/{id}/clips', {
    responses: {
      '200': {
        description: 'Video.Clip DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Clip)) where?: Where<Clip>,
  ): Promise<Count> {
    return this.videoRepository.clips(id).delete(where);
  }
}
