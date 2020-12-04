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
Exercise,
ExerciseCategory,
Category,
} from '../models';
import {ExerciseRepository} from '../repositories';

export class ExerciseCategoryController {
  constructor(
    @repository(ExerciseRepository) protected exerciseRepository: ExerciseRepository,
  ) { }

  @get('/exercises/{id}/categories', {
    responses: {
      '200': {
        description: 'Array of Exercise has many Category through ExerciseCategory',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.exerciseRepository.categories(id).find(filter);
  }

  @post('/exercises/{id}/categories', {
    responses: {
      '200': {
        description: 'create a Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Exercise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategoryInExercise',
            exclude: ['id'],
          }),
        },
      },
    }) category: Omit<Category, 'id'>,
  ): Promise<Category> {
    return this.exerciseRepository.categories(id).create(category);
  }

  @patch('/exercises/{id}/categories', {
    responses: {
      '200': {
        description: 'Exercise.Category PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Partial<Category>,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.exerciseRepository.categories(id).patch(category, where);
  }

  @del('/exercises/{id}/categories', {
    responses: {
      '200': {
        description: 'Exercise.Category DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.exerciseRepository.categories(id).delete(where);
  }
}
