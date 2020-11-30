import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Program, User} from '../models';
import {ProgramRepository} from '../repositories';

export class ProgramUserController {
  constructor(
    @repository(ProgramRepository)
    public programRepository: ProgramRepository,
  ) {}

  @get('/programs/{id}/created-by', {
    responses: {
      '200': {
        description: 'User Program was created by',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getCreatedBy(
    @param.path.number('id') id: typeof Program.prototype.id,
  ): Promise<User> {
    return this.programRepository.createdBy(id);
  }

  @get('/programs/{id}/assigned-to', {
    responses: {
      '200': {
        description: 'User Program is assigned to',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Program.prototype.id,
  ): Promise<User> {
    return this.programRepository.assignedTo(id);
  }
}
