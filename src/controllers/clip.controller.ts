import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Clip} from '../models';
import {ClipRepository, VideoRepository} from '../repositories';
import {MixpanelService, VideoUploadService} from '../services';

export class ClipController {
  constructor(
    @repository(ClipRepository)
    public clipRepository: ClipRepository,
    @repository(VideoRepository)
    protected videoRepository: VideoRepository,
    @inject('services.MixpanelService')
    protected mixpanelService: MixpanelService,
    @inject('services.VideoUploadService')
    protected videoUploadService: VideoUploadService,
  ) {}

  @post('/clips')
  @response(200, {
    description: 'Clip model instance',
    content: {'application/json': {schema: getModelSchemaRef(Clip)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {
            title: 'NewClip',
            exclude: ['id'],
          }),
        },
      },
    })
    clip: Omit<Clip, 'id'>,
  ): Promise<Clip> {
    const video = await this.videoRepository.findById(clip.videoId);
    // log a mixpanel event
    this.mixpanelService.trackEvent({
      name: 'video clipped',
      distinctId: video.email!,
      additionalProperties: {
        videoId: video.id,
      },
    });
    const finishedClip = await this.clipRepository.create(clip);
    return this.videoUploadService.sendJob(video, finishedClip);
  }

  @get('/clips/count')
  @response(200, {
    description: 'Clip model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Clip) where?: Where<Clip>): Promise<Count> {
    return this.clipRepository.count(where);
  }

  @get('/clips')
  @response(200, {
    description: 'Array of Clip model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Clip, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Clip) filter?: Filter<Clip>): Promise<Clip[]> {
    return this.clipRepository.find(filter);
  }

  @patch('/clips')
  @response(200, {
    description: 'Clip PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {partial: true}),
        },
      },
    })
    clip: Clip,
    @param.where(Clip) where?: Where<Clip>,
  ): Promise<Count> {
    return this.clipRepository.updateAll(clip, where);
  }

  @get('/clips/{id}')
  @response(200, {
    description: 'Clip model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Clip, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Clip, {exclude: 'where'}) filter?: FilterExcludingWhere<Clip>,
  ): Promise<Clip> {
    return this.clipRepository.findById(id, filter);
  }

  @patch('/clips/{id}')
  @response(204, {
    description: 'Clip PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {partial: true}),
        },
      },
    })
    clip: Clip,
  ): Promise<void> {
    await this.clipRepository.updateById(id, clip);
  }

  @put('/clips/{id}')
  @response(204, {
    description: 'Clip PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() clip: Clip): Promise<void> {
    await this.clipRepository.replaceById(id, clip);
  }

  @del('/clips/{id}')
  @response(204, {
    description: 'Clip DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const clip = await this.clipRepository.findById(id);
    await this.videoUploadService.deleteS3Video(clip.url);
    await this.videoUploadService.deleteS3Video(clip.analysisUrl);
    await this.clipRepository.deleteById(id);
  }
}
