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
  Program,
} from '../models';
import {WorkoutRepository} from '../repositories';

export class WorkoutProgramController {
  constructor(
    @repository(WorkoutRepository)
    public workoutRepository: WorkoutRepository,
  ) { }

  @get('/workouts/{id}/program', {
    responses: {
      '200': {
        description: 'Program belonging to Workout',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Program)},
          },
        },
      },
    },
  })
  async getProgram(
    @param.path.number('id') id: typeof Workout.prototype.id,
  ): Promise<Program> {
    return this.workoutRepository.program(id);
  }
}
