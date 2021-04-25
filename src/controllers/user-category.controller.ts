import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {User, Category} from '../models';
import {UserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {roleMatch, roleAndIdMatch} from '../services';

export class UserCategoryController {
  constructor(@repository(UserRepository) protected userRepository: UserRepository) {}

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'coach'],
    voters: [roleMatch],
  })
  @get('/users/{id}/categories-created', {
    responses: {
      '200': {
        description: 'Array of User has many Category',
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
    return this.userRepository.categoriesCreated(id).find(filter);
  }

  @patch('/users/{id}/categories-created', {
    responses: {
      '200': {
        description: 'User.Category PATCH success count',
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
    return this.userRepository.categoriesCreated(id).patch(category, where);
  }

  @del('/users/{id}/categories-created', {
    responses: {
      '200': {
        description: 'User.Category DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.userRepository.categoriesCreated(id).delete(where);
  }
}
