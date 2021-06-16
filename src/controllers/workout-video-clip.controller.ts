import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  WorkoutVideo,
  Clip,
} from '../models';
import {WorkoutVideoRepository} from '../repositories';

export class WorkoutVideoClipController {
  constructor(
    @repository(WorkoutVideoRepository) protected workoutVideoRepository: WorkoutVideoRepository,
  ) { }

  @get('/workout-videos/{id}/clips', {
    responses: {
      '200': {
        description: 'Array of WorkoutVideo has many Clip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Clip)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Clip>,
  ): Promise<Clip[]> {
    return this.workoutVideoRepository.clips(id).find(filter);
  }

  @post('/workout-videos/{id}/clips', {
    responses: {
      '200': {
        description: 'WorkoutVideo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Clip)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof WorkoutVideo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {
            title: 'NewClipInWorkoutVideo',
            exclude: ['id'],
            optional: ['workoutVideoId']
          }),
        },
      },
    }) clip: Omit<Clip, 'id'>,
  ): Promise<Clip> {
    return this.workoutVideoRepository.clips(id).create(clip);
  }

  @patch('/workout-videos/{id}/clips', {
    responses: {
      '200': {
        description: 'WorkoutVideo.Clip PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {partial: true}),
        },
      },
    })
    clip: Partial<Clip>,
    @param.query.object('where', getWhereSchemaFor(Clip)) where?: Where<Clip>,
  ): Promise<Count> {
    return this.workoutVideoRepository.clips(id).patch(clip, where);
  }

  @del('/workout-videos/{id}/clips', {
    responses: {
      '200': {
        description: 'WorkoutVideo.Clip DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Clip)) where?: Where<Clip>,
  ): Promise<Count> {
    return this.workoutVideoRepository.clips(id).delete(where);
  }
}
