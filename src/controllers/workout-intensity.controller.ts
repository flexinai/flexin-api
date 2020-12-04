import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Workout,
  Intensity,
} from '../models';
import {WorkoutRepository} from '../repositories';

export class WorkoutIntensityController {
  constructor(
    @repository(WorkoutRepository)
    public workoutRepository: WorkoutRepository,
  ) { }

  @get('/workouts/{id}/intensity', {
    responses: {
      '200': {
        description: 'Intensity belonging to Workout',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Intensity)},
          },
        },
      },
    },
  })
  async getIntensity(
    @param.path.number('id') id: typeof Workout.prototype.id,
  ): Promise<Intensity> {
    return this.workoutRepository.intensity(id);
  }
}
