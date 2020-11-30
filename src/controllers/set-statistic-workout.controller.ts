import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SetStatistic,
  Workout,
} from '../models';
import {SetStatisticRepository} from '../repositories';

export class SetStatisticWorkoutController {
  constructor(
    @repository(SetStatisticRepository)
    public setStatisticRepository: SetStatisticRepository,
  ) { }

  @get('/set-statistics/{id}/workout', {
    responses: {
      '200': {
        description: 'Workout belonging to SetStatistic',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Workout)},
          },
        },
      },
    },
  })
  async getWorkout(
    @param.path.number('id') id: typeof SetStatistic.prototype.id,
  ): Promise<Workout> {
    return this.setStatisticRepository.workout(id);
  }
}
