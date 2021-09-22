import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Video,
  User,
} from '../models';
import {VideoRepository} from '../repositories';

export class VideoUserController {
  constructor(
    @repository(VideoRepository)
    public videoRepository: VideoRepository,
  ) { }

  @get('/videos/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Video',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Video.prototype.id,
  ): Promise<User> {
    return this.videoRepository.reviewedBy(id);
  }
}
