import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {User, Annotation} from '../models';
import {UserRepository} from '../repositories';

export class UserAnnotationAssignedController {
  constructor(@repository(UserRepository) protected userRepository: UserRepository) {}

  @get('/users/{id}/annotations-assigned', {
    responses: {
      '200': {
        description: 'Array of User has many Annotation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Annotation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Annotation>,
  ): Promise<Annotation[]> {
    return this.userRepository.annotationsAssigned(id).find(filter);
  }

  @post('/users/{id}/annotations-assigned', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Annotation)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Annotation, {
            title: 'NewAnnotationInUser',
            exclude: ['id'],
            optional: ['createdById'],
          }),
        },
      },
    })
    annotation: Omit<Annotation, 'id'>,
  ): Promise<Annotation> {
    return this.userRepository.annotationsAssigned(id).create(annotation);
  }

  @patch('/users/{id}/annotations-assigned', {
    responses: {
      '200': {
        description: 'User.Annotation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Annotation, {partial: true}),
        },
      },
    })
    annotation: Partial<Annotation>,
    @param.query.object('where', getWhereSchemaFor(Annotation)) where?: Where<Annotation>,
  ): Promise<Count> {
    return this.userRepository.annotationsAssigned(id).patch(annotation, where);
  }

  @del('/users/{id}/annotations-assigned', {
    responses: {
      '200': {
        description: 'User.Annotation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Annotation)) where?: Where<Annotation>,
  ): Promise<Count> {
    return this.userRepository.annotationsAssigned(id).delete(where);
  }
}
