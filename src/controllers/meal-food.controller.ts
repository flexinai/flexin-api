import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Meal, Food} from '../models';
import {MealRepository} from '../repositories';

export class MealFoodController {
  constructor(
    @repository(MealRepository)
    public mealRepository: MealRepository,
  ) {}

  @get('/meals/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to Meal',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.number('id') id: typeof Meal.prototype.id,
  ): Promise<Food> {
    return this.mealRepository.food(id);
  }

  @get('/meals/{id}/chosen-food', {
    responses: {
      '200': {
        description: 'chosenFood belonging to Meal',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getChosenFood(
    @param.path.number('id') id: typeof Meal.prototype.id,
  ): Promise<Food> {
    return this.mealRepository.chosenFood(id);
  }
}
