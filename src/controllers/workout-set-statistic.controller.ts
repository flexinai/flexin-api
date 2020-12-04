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
  Workout,
  SetStatistic,
} from '../models';
import {WorkoutRepository} from '../repositories';

export class WorkoutSetStatisticController {
  constructor(
    @repository(WorkoutRepository) protected workoutRepository: WorkoutRepository,
  ) { }

  @get('/workouts/{id}/set-statistics', {
    responses: {
      '200': {
        description: 'Array of Workout has many SetStatistic',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SetStatistic)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<SetStatistic>,
  ): Promise<SetStatistic[]> {
    return this.workoutRepository.setStatistics(id).find(filter);
  }

  @post('/workouts/{id}/set-statistics', {
    responses: {
      '200': {
        description: 'Workout model instance',
        content: {'application/json': {schema: getModelSchemaRef(SetStatistic)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Workout.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetStatistic, {
            title: 'NewSetStatisticInWorkout',
            exclude: ['id'],
            optional: ['workoutId']
          }),
        },
      },
    }) setStatistic: Omit<SetStatistic, 'id'>,
  ): Promise<SetStatistic> {
    return this.workoutRepository.setStatistics(id).create(setStatistic);
  }

  @patch('/workouts/{id}/set-statistics', {
    responses: {
      '200': {
        description: 'Workout.SetStatistic PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetStatistic, {partial: true}),
        },
      },
    })
    setStatistic: Partial<SetStatistic>,
    @param.query.object('where', getWhereSchemaFor(SetStatistic)) where?: Where<SetStatistic>,
  ): Promise<Count> {
    return this.workoutRepository.setStatistics(id).patch(setStatistic, where);
  }

  @del('/workouts/{id}/set-statistics', {
    responses: {
      '200': {
        description: 'Workout.SetStatistic DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(SetStatistic)) where?: Where<SetStatistic>,
  ): Promise<Count> {
    return this.workoutRepository.setStatistics(id).delete(where);
  }
}
