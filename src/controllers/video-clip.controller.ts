import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Clip, Video
} from '../models';
import {VideoRepository} from '../repositories';
import {inject} from '@loopback/core';
import {MixpanelEvent, MixpanelService} from '../services';

export class VideoClipController {
  constructor(
    @repository(VideoRepository) protected videoRepository: VideoRepository,
    @inject('services.MixpanelService')
    protected mixpanelService: MixpanelService,
  ) {}

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
    @param.path.string('id') id: string,
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
    @param.path.string('id') id: typeof Video.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {
            title: 'NewClipInVideo',
            exclude: ['id'],
            optional: ['videoId'],
          }),
        },
      },
    })
    clip: Omit<Clip, 'id'>,
  ): Promise<Clip> {
    let video = await this.videoRepository.findById(id);
    // log a mixpanel event
    this.mixpanelService.trackEvent({
      name: 'video clipped',
      distinctId: video.email!,
      additionalProperties: {
        videoId: video.id,
      },
    });
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
    @param.path.string('id') id: string,
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
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Clip)) where?: Where<Clip>,
  ): Promise<Count> {
    return this.videoRepository.clips(id).delete(where);
  }
}
