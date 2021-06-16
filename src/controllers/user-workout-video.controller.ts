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
  User,
  WorkoutVideo,
} from '../models';
import {UserRepository} from '../repositories';

export class UserWorkoutVideoController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/workout-videos', {
    responses: {
      '200': {
        description: 'Array of User has many WorkoutVideo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(WorkoutVideo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<WorkoutVideo>,
  ): Promise<WorkoutVideo[]> {
    return this.userRepository.workoutVideos(id).find(filter);
  }

  @post('/users/{id}/workout-videos', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(WorkoutVideo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkoutVideo, {
            title: 'NewWorkoutVideoInUser',
            exclude: ['id'],
            optional: ['createdById']
          }),
        },
      },
    }) workoutVideo: Omit<WorkoutVideo, 'id'>,
  ): Promise<WorkoutVideo> {
    return this.userRepository.workoutVideos(id).create(workoutVideo);
  }

  @patch('/users/{id}/workout-videos', {
    responses: {
      '200': {
        description: 'User.WorkoutVideo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkoutVideo, {partial: true}),
        },
      },
    })
    workoutVideo: Partial<WorkoutVideo>,
    @param.query.object('where', getWhereSchemaFor(WorkoutVideo)) where?: Where<WorkoutVideo>,
  ): Promise<Count> {
    return this.userRepository.workoutVideos(id).patch(workoutVideo, where);
  }

  @del('/users/{id}/workout-videos', {
    responses: {
      '200': {
        description: 'User.WorkoutVideo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(WorkoutVideo)) where?: Where<WorkoutVideo>,
  ): Promise<Count> {
    return this.userRepository.workoutVideos(id).delete(where);
  }
}
