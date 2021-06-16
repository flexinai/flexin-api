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
  WorkoutVideo,
} from '../models';
import {ClipRepository} from '../repositories';

export class ClipWorkoutVideoController {
  constructor(
    @repository(ClipRepository)
    public clipRepository: ClipRepository,
  ) { }

  @get('/clips/{id}/workout-video', {
    responses: {
      '200': {
        description: 'WorkoutVideo belonging to Clip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(WorkoutVideo)},
          },
        },
      },
    },
  })
  async getWorkoutVideo(
    @param.path.number('id') id: typeof Clip.prototype.id,
  ): Promise<WorkoutVideo> {
    return this.clipRepository.workoutVideo(id);
  }
}
