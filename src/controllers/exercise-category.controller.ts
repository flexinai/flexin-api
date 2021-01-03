import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Exercise, ExerciseCategory, Category} from '../models';
import {ExerciseRepository, ExerciseCategoryRepository} from '../repositories';

export class ExerciseCategoryController {
  constructor(
    @repository(ExerciseRepository)
    protected exerciseRepository: ExerciseRepository,
    @repository(ExerciseCategoryRepository)
    protected exerciseCategoryRepository: ExerciseCategoryRepository,
  ) {}

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
    })
    category: Omit<Category, 'id'>,
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

  /* create a link between an existing exercise and category */
  @patch('/exercises-categories', {
    responses: {
      '204': {
        description: 'Exercise-Category link success',
      },
    },
  })
  async link(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ExerciseCategory, {
            title: 'NewExerciseCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    exerciseCategory: Omit<ExerciseCategory, 'id'>,
  ): Promise<void> {
    return this.exerciseRepository.categories(exerciseCategory.exerciseId).link(exerciseCategory.categoryId);
  }

  /* delete a link between an existing exercise and category */
  @del('/exercises-categories', {
    responses: {
      '204': {
        description: 'Exercise-Category unlink success',
      },
    },
  })
  async unlink(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ExerciseCategory, {
            title: 'NewExerciseCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    exerciseCategory: Omit<ExerciseCategory, 'id'>,
  ): Promise<void> {
    // create a filter looking for a link between exerciseId and categoryId
    const filter: Filter<ExerciseCategory> = {
      where: {
        and: [{exerciseId: exerciseCategory.exerciseId}, {categoryId: exerciseCategory.categoryId}],
      },
    };
    const linkToDelete = await this.exerciseCategoryRepository.findOne(filter);
    if (linkToDelete) {
      return this.exerciseCategoryRepository.deleteById(linkToDelete.id);
    } else {
      throw new HttpErrors.NotFound('ExerciseCategory link not found');
    }
  }
}
