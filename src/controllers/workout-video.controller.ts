import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {WorkoutVideo} from '../models';
import {WorkoutVideoRepository} from '../repositories';

export class WorkoutVideoController {
  constructor(
    @repository(WorkoutVideoRepository)
    public workoutVideoRepository : WorkoutVideoRepository,
  ) {}

  @post('/workout-videos')
  @response(200, {
    description: 'WorkoutVideo model instance',
    content: {'application/json': {schema: getModelSchemaRef(WorkoutVideo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkoutVideo, {
            title: 'NewWorkoutVideo',
            exclude: ['id'],
          }),
        },
      },
    })
    workoutVideo: Omit<WorkoutVideo, 'id'>,
  ): Promise<WorkoutVideo> {
    return this.workoutVideoRepository.create(workoutVideo);
  }

  @get('/workout-videos/count')
  @response(200, {
    description: 'WorkoutVideo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(WorkoutVideo) where?: Where<WorkoutVideo>,
  ): Promise<Count> {
    return this.workoutVideoRepository.count(where);
  }

  @get('/workout-videos')
  @response(200, {
    description: 'Array of WorkoutVideo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WorkoutVideo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(WorkoutVideo) filter?: Filter<WorkoutVideo>,
  ): Promise<WorkoutVideo[]> {
    return this.workoutVideoRepository.find(filter);
  }

  @patch('/workout-videos')
  @response(200, {
    description: 'WorkoutVideo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkoutVideo, {partial: true}),
        },
      },
    })
    workoutVideo: WorkoutVideo,
    @param.where(WorkoutVideo) where?: Where<WorkoutVideo>,
  ): Promise<Count> {
    return this.workoutVideoRepository.updateAll(workoutVideo, where);
  }

  @get('/workout-videos/{id}')
  @response(200, {
    description: 'WorkoutVideo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(WorkoutVideo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(WorkoutVideo, {exclude: 'where'}) filter?: FilterExcludingWhere<WorkoutVideo>
  ): Promise<WorkoutVideo> {
    return this.workoutVideoRepository.findById(id, filter);
  }

  @patch('/workout-videos/{id}')
  @response(204, {
    description: 'WorkoutVideo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkoutVideo, {partial: true}),
        },
      },
    })
    workoutVideo: WorkoutVideo,
  ): Promise<void> {
    await this.workoutVideoRepository.updateById(id, workoutVideo);
  }

  @put('/workout-videos/{id}')
  @response(204, {
    description: 'WorkoutVideo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() workoutVideo: WorkoutVideo,
  ): Promise<void> {
    await this.workoutVideoRepository.replaceById(id, workoutVideo);
  }

  @del('/workout-videos/{id}')
  @response(204, {
    description: 'WorkoutVideo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.workoutVideoRepository.deleteById(id);
  }
}
