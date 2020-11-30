import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Intensity, User} from '../models';
import {IntensityRepository} from '../repositories';

export class IntensityUserController {
  constructor(
    @repository(IntensityRepository)
    public intensityRepository: IntensityRepository,
  ) {}

  @get('/intensities/{id}/created-by', {
    responses: {
      '200': {
        description: 'User Intensity was created by',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Intensity.prototype.id,
  ): Promise<User> {
    return this.intensityRepository.createdBy(id);
  }
}
