import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Clip,
  Video,
} from '../models';
import {ClipRepository} from '../repositories';

export class ClipVideoController {
  constructor(
    @repository(ClipRepository)
    public clipRepository: ClipRepository,
  ) { }

  @get('/clips/{id}/video', {
    responses: {
      '200': {
        description: 'Video belonging to Clip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Video)},
          },
        },
      },
    },
  })
  async getVideo(
    @param.path.number('id') id: typeof Clip.prototype.id,
  ): Promise<Video> {
    return this.clipRepository.video(id);
  }
}
