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
  MealPlan,
  Meal,
} from '../models';
import {MealPlanRepository} from '../repositories';

export class MealPlanMealController {
  constructor(
    @repository(MealPlanRepository) protected mealPlanRepository: MealPlanRepository,
  ) { }

  @get('/meal-plans/{id}/meals', {
    responses: {
      '200': {
        description: 'Array of MealPlan has many Meal',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Meal)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Meal>,
  ): Promise<Meal[]> {
    return this.mealPlanRepository.meals(id).find(filter);
  }

  @post('/meal-plans/{id}/meals', {
    responses: {
      '200': {
        description: 'MealPlan model instance',
        content: {'application/json': {schema: getModelSchemaRef(Meal)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof MealPlan.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meal, {
            title: 'NewMealInMealPlan',
            exclude: ['id'],
            optional: ['mealPlanId']
          }),
        },
      },
    }) meal: Omit<Meal, 'id'>,
  ): Promise<Meal> {
    return this.mealPlanRepository.meals(id).create(meal);
  }

  @patch('/meal-plans/{id}/meals', {
    responses: {
      '200': {
        description: 'MealPlan.Meal PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meal, {partial: true}),
        },
      },
    })
    meal: Partial<Meal>,
    @param.query.object('where', getWhereSchemaFor(Meal)) where?: Where<Meal>,
  ): Promise<Count> {
    return this.mealPlanRepository.meals(id).patch(meal, where);
  }

  @del('/meal-plans/{id}/meals', {
    responses: {
      '200': {
        description: 'MealPlan.Meal DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Meal)) where?: Where<Meal>,
  ): Promise<Count> {
    return this.mealPlanRepository.meals(id).delete(where);
  }
}
