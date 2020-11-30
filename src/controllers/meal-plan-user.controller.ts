import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {MealPlan, User} from '../models';
import {MealPlanRepository} from '../repositories';

export class MealPlanUserController {
  constructor(
    @repository(MealPlanRepository)
    public mealPlanRepository: MealPlanRepository,
  ) {}

  @get('/meal-plans/{id}/created-by', {
    responses: {
      '200': {
        description: 'User MealPlan was created by',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getCreatedBy(
    @param.path.number('id') id: typeof MealPlan.prototype.id,
  ): Promise<User> {
    return this.mealPlanRepository.createdBy(id);
  }

  @get('/meal-plans/{id}/assigned-to', {
    responses: {
      '200': {
        description: 'User MealPlan is assigned to',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getAssignedTo(
    @param.path.number('id') id: typeof MealPlan.prototype.id,
  ): Promise<User> {
    return this.mealPlanRepository.assignedTo(id);
  }
}
