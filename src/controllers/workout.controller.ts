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
} from '@loopback/rest';
import {Workout} from '../models';
import {WorkoutRepository} from '../repositories';

export class WorkoutController {
  constructor(
    @repository(WorkoutRepository)
    public workoutRepository : WorkoutRepository,
  ) {}

  @post('/workouts', {
    responses: {
      '200': {
        description: 'Workout model instance',
        content: {'application/json': {schema: getModelSchemaRef(Workout)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workout, {
            title: 'NewWorkout',
            exclude: ['id'],
          }),
        },
      },
    })
    workout: Omit<Workout, 'id'>,
  ): Promise<Workout> {
    return this.workoutRepository.create(workout);
  }

  @get('/workouts/count', {
    responses: {
      '200': {
        description: 'Workout model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Workout) where?: Where<Workout>,
  ): Promise<Count> {
    return this.workoutRepository.count(where);
  }

  @get('/workouts', {
    responses: {
      '200': {
        description: 'Array of Workout model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Workout, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Workout) filter?: Filter<Workout>,
  ): Promise<Workout[]> {
    return this.workoutRepository.find(filter);
  }

  @patch('/workouts', {
    responses: {
      '200': {
        description: 'Workout PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workout, {partial: true}),
        },
      },
    })
    workout: Workout,
    @param.where(Workout) where?: Where<Workout>,
  ): Promise<Count> {
    return this.workoutRepository.updateAll(workout, where);
  }

  @get('/workouts/{id}', {
    responses: {
      '200': {
        description: 'Workout model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Workout, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Workout, {exclude: 'where'}) filter?: FilterExcludingWhere<Workout>
  ): Promise<Workout> {
    return this.workoutRepository.findById(id, filter);
  }

  @patch('/workouts/{id}', {
    responses: {
      '204': {
        description: 'Workout PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workout, {partial: true}),
        },
      },
    })
    workout: Workout,
  ): Promise<void> {
    await this.workoutRepository.updateById(id, workout);
  }

  @put('/workouts/{id}', {
    responses: {
      '204': {
        description: 'Workout PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() workout: Workout,
  ): Promise<void> {
    await this.workoutRepository.replaceById(id, workout);
  }

  @del('/workouts/{id}', {
    responses: {
      '204': {
        description: 'Workout DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.workoutRepository.deleteById(id);
  }
}
