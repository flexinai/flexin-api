import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Category,
  User,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryUserController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Category',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Category.prototype.id,
  ): Promise<User> {
    return this.categoryRepository.createdBy(id);
  }
}
