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
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
User,
UserProgram,
Program,
} from '../models';
import {UserProgramRepository, UserRepository} from '../repositories';

export class UserProgramController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserProgramRepository)
    protected userProgramRepository: UserProgramRepository,
  ) { }

  @get('/users/{id}/programs', {
    responses: {
      '200': {
        description: 'Array of User has many Program through UserProgram',
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
    return this.userRepository.programs(id).find(filter);
  }

  @post('/users/{id}/programs', {
    responses: {
      '200': {
        description: 'create a Program model instance',
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
          }),
        },
      },
    }) program: Omit<Program, 'id'>,
  ): Promise<Program> {
    return this.userRepository.programs(id).create(program);
  }

  @patch('/users/{id}/programs', {
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
    return this.userRepository.programs(id).patch(program, where);
  }

  @del('/users/{id}/programs', {
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
    return this.userRepository.programs(id).delete(where);
  }

  // create a link between an existing user and program
  @patch('/users-programs', {
    responses: {
      '204': {
        description: 'User-Program link succeess',
      }
    }
  })
  async link(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProgram, {
            title: 'NewUserProgram',
            exclude: ['id'],
          })
        }
      }
    })
    userProgram: Omit<UserProgram, 'id'>,
  ): Promise<void> {
    return this.userRepository.programs(userProgram.userId).link(userProgram.programId);
  }

  // delete a lnink between an existing user and program
  @del('users-programs', {
    responses: {
      '204': {
        description: 'User-Program unlink success',
      }
    }
  })
  async unlink(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProgram, {
            title: 'NewUserProgram',
            exclude: ['id'],
          })
        }
      }
    })
    userProgram: Omit<UserProgram, 'id'>,
  ): Promise<void> {
    // create a filter looking for a link between userId and programId
    const filter: Filter<UserProgram> = {
      where: {
        and: [{userId: userProgram.userId}, {programId: userProgram.programId}]
      }
    };
    const linkToDelete = await this.userProgramRepository.findOne(filter);
    if (linkToDelete) {
      return this.userProgramRepository.deleteById(linkToDelete.id);
    } else {
      throw new HttpErrors.NotFound('UserProgram link not found');
    }
  }
}
