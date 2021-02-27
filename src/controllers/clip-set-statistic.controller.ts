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
  SetStatistic,
} from '../models';
import {ClipRepository} from '../repositories';

export class ClipSetStatisticController {
  constructor(
    @repository(ClipRepository)
    public clipRepository: ClipRepository,
  ) { }

  @get('/clips/{id}/set-statistic', {
    responses: {
      '200': {
        description: 'SetStatistic belonging to Clip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SetStatistic)},
          },
        },
      },
    },
  })
  async getSetStatistic(
    @param.path.number('id') id: typeof Clip.prototype.id,
  ): Promise<SetStatistic> {
    return this.clipRepository.setStatistic(id);
  }
}
