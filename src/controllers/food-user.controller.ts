import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Food,
  User,
} from '../models';
import {FoodRepository} from '../repositories';

export class FoodUserController {
  constructor(
    @repository(FoodRepository)
    public foodRepository: FoodRepository,
  ) { }

  @get('/foods/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Food',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Food.prototype.id,
  ): Promise<User> {
    return this.foodRepository.createdBy(id);
  }
}
