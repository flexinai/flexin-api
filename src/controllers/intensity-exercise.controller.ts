import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Intensity,
  Exercise,
} from '../models';
import {IntensityRepository} from '../repositories';

export class IntensityExerciseController {
  constructor(
    @repository(IntensityRepository)
    public intensityRepository: IntensityRepository,
  ) { }

  @get('/intensities/{id}/exercise', {
    responses: {
      '200': {
        description: 'Exercise belonging to Intensity',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Exercise)},
          },
        },
      },
    },
  })
  async getExercise(
    @param.path.number('id') id: typeof Intensity.prototype.id,
  ): Promise<Exercise> {
    return this.intensityRepository.exercise(id);
  }
}
