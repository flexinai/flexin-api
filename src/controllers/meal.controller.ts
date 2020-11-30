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
import {Meal} from '../models';
import {MealRepository} from '../repositories';

export class MealController {
  constructor(
    @repository(MealRepository)
    public mealRepository : MealRepository,
  ) {}

  @post('/meals', {
    responses: {
      '200': {
        description: 'Meal model instance',
        content: {'application/json': {schema: getModelSchemaRef(Meal)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meal, {
            title: 'NewMeal',
            exclude: ['id'],
          }),
        },
      },
    })
    meal: Omit<Meal, 'id'>,
  ): Promise<Meal> {
    return this.mealRepository.create(meal);
  }

  @get('/meals/count', {
    responses: {
      '200': {
        description: 'Meal model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Meal) where?: Where<Meal>,
  ): Promise<Count> {
    return this.mealRepository.count(where);
  }

  @get('/meals', {
    responses: {
      '200': {
        description: 'Array of Meal model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Meal, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Meal) filter?: Filter<Meal>,
  ): Promise<Meal[]> {
    return this.mealRepository.find(filter);
  }

  @patch('/meals', {
    responses: {
      '200': {
        description: 'Meal PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meal, {partial: true}),
        },
      },
    })
    meal: Meal,
    @param.where(Meal) where?: Where<Meal>,
  ): Promise<Count> {
    return this.mealRepository.updateAll(meal, where);
  }

  @get('/meals/{id}', {
    responses: {
      '200': {
        description: 'Meal model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Meal, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Meal, {exclude: 'where'}) filter?: FilterExcludingWhere<Meal>
  ): Promise<Meal> {
    return this.mealRepository.findById(id, filter);
  }

  @patch('/meals/{id}', {
    responses: {
      '204': {
        description: 'Meal PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meal, {partial: true}),
        },
      },
    })
    meal: Meal,
  ): Promise<void> {
    await this.mealRepository.updateById(id, meal);
  }

  @put('/meals/{id}', {
    responses: {
      '204': {
        description: 'Meal PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() meal: Meal,
  ): Promise<void> {
    await this.mealRepository.replaceById(id, meal);
  }

  @del('/meals/{id}', {
    responses: {
      '204': {
        description: 'Meal DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.mealRepository.deleteById(id);
  }
}
