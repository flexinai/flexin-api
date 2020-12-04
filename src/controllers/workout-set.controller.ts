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
  Set,
} from '../models';
import {WorkoutRepository} from '../repositories';

export class WorkoutSetController {
  constructor(
    @repository(WorkoutRepository) protected workoutRepository: WorkoutRepository,
  ) { }

  @get('/workouts/{id}/sets', {
    responses: {
      '200': {
        description: 'Array of Workout has many Set',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Set)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Set>,
  ): Promise<Set[]> {
    return this.workoutRepository.sets(id).find(filter);
  }

  @post('/workouts/{id}/sets', {
    responses: {
      '200': {
        description: 'Workout model instance',
        content: {'application/json': {schema: getModelSchemaRef(Set)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Workout.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Set, {
            title: 'NewSetInWorkout',
            exclude: ['id'],
            optional: ['workoutId']
          }),
        },
      },
    }) set: Omit<Set, 'id'>,
  ): Promise<Set> {
    return this.workoutRepository.sets(id).create(set);
  }

  @patch('/workouts/{id}/sets', {
    responses: {
      '200': {
        description: 'Workout.Set PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Set, {partial: true}),
        },
      },
    })
    set: Partial<Set>,
    @param.query.object('where', getWhereSchemaFor(Set)) where?: Where<Set>,
  ): Promise<Count> {
    return this.workoutRepository.sets(id).patch(set, where);
  }

  @del('/workouts/{id}/sets', {
    responses: {
      '200': {
        description: 'Workout.Set DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Set)) where?: Where<Set>,
  ): Promise<Count> {
    return this.workoutRepository.sets(id).delete(where);
  }
}
