import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Meal,
  Program,
} from '../models';
import {MealRepository} from '../repositories';

export class MealProgramController {
  constructor(
    @repository(MealRepository)
    public mealRepository: MealRepository,
  ) { }

  @get('/meals/{id}/program', {
    responses: {
      '200': {
        description: 'Program belonging to Meal',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Program)},
          },
        },
      },
    },
  })
  async getProgram(
    @param.path.number('id') id: typeof Meal.prototype.id,
  ): Promise<Program> {
    return this.mealRepository.program(id);
  }
}
