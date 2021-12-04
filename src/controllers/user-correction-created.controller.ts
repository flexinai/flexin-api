import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {Correction, User} from '../models';
import {UserRepository} from '../repositories';

export class UserCorrectionCreatedController {
  constructor(@repository(UserRepository) protected userRepository: UserRepository) {}

  @get('/users/{id}/corrections-created', {
    responses: {
      '200': {
        description: 'Array of User has many Correction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Correction)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Correction>,
  ): Promise<Correction[]> {
    return this.userRepository.correctionsCreated(id).find(filter);
  }

  @post('/users/{id}/corrections-created', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Correction)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Correction, {
            title: 'NewCorrectionInUser',
            exclude: ['id'],
            optional: ['createdById'],
          }),
        },
      },
    })
    correction: Omit<Correction, 'id'>,
  ): Promise<Correction> {
    return this.userRepository.correctionsCreated(id).create(correction);
  }

  @patch('/users/{id}/corrections-created', {
    responses: {
      '200': {
        description: 'User.Correction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Correction, {partial: true}),
        },
      },
    })
    correction: Partial<Correction>,
    @param.query.object('where', getWhereSchemaFor(Correction)) where?: Where<Correction>,
  ): Promise<Count> {
    return this.userRepository.correctionsCreated(id).patch(correction, where);
  }

  @del('/users/{id}/corrections-created', {
    responses: {
      '200': {
        description: 'User.Correction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Correction)) where?: Where<Correction>,
  ): Promise<Count> {
    return this.userRepository.correctionsCreated(id).delete(where);
  }
}
