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
import {Exercise} from '../models';
import {ExerciseRepository} from '../repositories';

export class ExerciseController {
  constructor(
    @repository(ExerciseRepository)
    public exerciseRepository : ExerciseRepository,
  ) {}

  @post('/exercises', {
    responses: {
      '200': {
        description: 'Exercise model instance',
        content: {'application/json': {schema: getModelSchemaRef(Exercise)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {
            title: 'NewExercise',
            exclude: ['id'],
          }),
        },
      },
    })
    exercise: Omit<Exercise, 'id'>,
  ): Promise<Exercise> {
    return this.exerciseRepository.create(exercise);
  }

  @get('/exercises/count', {
    responses: {
      '200': {
        description: 'Exercise model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Exercise) where?: Where<Exercise>,
  ): Promise<Count> {
    return this.exerciseRepository.count(where);
  }

  @get('/exercises', {
    responses: {
      '200': {
        description: 'Array of Exercise model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Exercise, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Exercise) filter?: Filter<Exercise>,
  ): Promise<Exercise[]> {
    return this.exerciseRepository.find(filter);
  }

  @patch('/exercises', {
    responses: {
      '200': {
        description: 'Exercise PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {partial: true}),
        },
      },
    })
    exercise: Exercise,
    @param.where(Exercise) where?: Where<Exercise>,
  ): Promise<Count> {
    return this.exerciseRepository.updateAll(exercise, where);
  }

  @get('/exercises/{id}', {
    responses: {
      '200': {
        description: 'Exercise model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Exercise, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Exercise, {exclude: 'where'}) filter?: FilterExcludingWhere<Exercise>
  ): Promise<Exercise> {
    return this.exerciseRepository.findById(id, filter);
  }

  @patch('/exercises/{id}', {
    responses: {
      '204': {
        description: 'Exercise PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {partial: true}),
        },
      },
    })
    exercise: Exercise,
  ): Promise<void> {
    await this.exerciseRepository.updateById(id, exercise);
  }

  @put('/exercises/{id}', {
    responses: {
      '204': {
        description: 'Exercise PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() exercise: Exercise,
  ): Promise<void> {
    await this.exerciseRepository.replaceById(id, exercise);
  }

  @del('/exercises/{id}', {
    responses: {
      '204': {
        description: 'Exercise DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.exerciseRepository.deleteById(id);
  }
}
