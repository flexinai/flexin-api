import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {User, Program} from '../models';
import {UserRepository} from '../repositories';

export class UserProgramCreatorController {
  constructor(@repository(UserRepository) protected userRepository: UserRepository) {}

  @get('/users/{id}/programs-created', {
    responses: {
      '200': {
        description: 'Array of User has many Program',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Program)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Program>,
  ): Promise<Program[]> {
    return this.userRepository.programsCreated(id).find(filter);
  }

  @post('/users/{id}/programs-created', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Program)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Program, {
            title: 'NewProgramInUser',
            exclude: ['id'],
            optional: ['createdById'],
          }),
        },
      },
    })
    program: Omit<Program, 'id'>,
  ): Promise<Program> {
    return this.userRepository.programsCreated(id).create(program);
  }

  @patch('/users/{id}/programs-created', {
    responses: {
      '200': {
        description: 'User.Program PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Program, {partial: true}),
        },
      },
    })
    program: Partial<Program>,
    @param.query.object('where', getWhereSchemaFor(Program)) where?: Where<Program>,
  ): Promise<Count> {
    return this.userRepository.programsCreated(id).patch(program, where);
  }

  @del('/users/{id}/programs-created', {
    responses: {
      '200': {
        description: 'User.Program DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Program)) where?: Where<Program>,
  ): Promise<Count> {
    return this.userRepository.programsCreated(id).delete(where);
  }
}
