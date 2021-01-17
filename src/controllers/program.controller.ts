import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Program} from '../models';
import {ProgramRepository} from '../repositories';

export class ProgramController {
  constructor(
    @repository(ProgramRepository)
    public programRepository: ProgramRepository,
  ) {}

  @post('/programs', {
    responses: {
      '200': {
        description: 'Program model instance',
        content: {'application/json': {schema: getModelSchemaRef(Program)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Program, {
            title: 'NewProgram',
            exclude: ['id'],
          }),
        },
      },
    })
    program: Omit<Program, 'id'>,
  ): Promise<Program> {
    return this.programRepository.create(program);
  }

  @get('/programs/count', {
    responses: {
      '200': {
        description: 'Program model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Program) where?: Where<Program>): Promise<Count> {
    return this.programRepository.count(where);
  }

  @get('/programs', {
    responses: {
      '200': {
        description: 'Array of Program model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Program, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Program) filter?: Filter<Program>): Promise<Program[]> {
    return this.programRepository.find(filter);
  }

  @patch('/programs', {
    responses: {
      '200': {
        description: 'Program PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Program, {partial: true}),
        },
      },
    })
    program: Program,
    @param.where(Program) where?: Where<Program>,
  ): Promise<Count> {
    return this.programRepository.updateAll(program, where);
  }

  @get('/programs/{id}', {
    responses: {
      '200': {
        description: 'Program model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Program, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Program, {exclude: 'where'}) filter?: FilterExcludingWhere<Program>,
  ): Promise<Program> {
    return this.programRepository.findById(id, filter);
  }

  @patch('/programs/{id}', {
    responses: {
      '204': {
        description: 'Program PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Program, {partial: true}),
        },
      },
    })
    program: Program,
  ): Promise<void> {
    await this.programRepository.updateById(id, program);
  }

  @put('/programs/{id}', {
    responses: {
      '204': {
        description: 'Program PUT success',
      },
    },
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() program: Program): Promise<void> {
    await this.programRepository.replaceById(id, program);
  }

  @del('/programs/{id}', {
    responses: {
      '204': {
        description: 'Program DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.programRepository.deleteById(id);
  }
}
