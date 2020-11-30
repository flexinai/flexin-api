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
  Exercise,
} from '../models';
import {WorkoutRepository} from '../repositories';

export class WorkoutExerciseController {
  constructor(
    @repository(WorkoutRepository)
    public workoutRepository: WorkoutRepository,
  ) { }

  @get('/workouts/{id}/exercise', {
    responses: {
      '200': {
        description: 'Exercise belonging to Workout',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Exercise)},
          },
        },
      },
    },
  })
  async getExercise(
    @param.path.number('id') id: typeof Workout.prototype.id,
  ): Promise<Exercise> {
    return this.workoutRepository.exercise(id);
  }
}
