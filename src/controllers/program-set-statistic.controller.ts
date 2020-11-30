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
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Program,
  SetStatistic,
} from '../models';
import {ProgramRepository} from '../repositories';

export class ProgramSetStatisticController {
  constructor(
    @repository(ProgramRepository) protected programRepository: ProgramRepository,
  ) { }

  @get('/programs/{id}/set-statistics', {
    responses: {
      '200': {
        description: 'Array of Program has many SetStatistic',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SetStatistic)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<SetStatistic>,
  ): Promise<SetStatistic[]> {
    return this.programRepository.setStatistics(id).find(filter);
  }

  @post('/programs/{id}/set-statistics', {
    responses: {
      '200': {
        description: 'Program model instance',
        content: {'application/json': {schema: getModelSchemaRef(SetStatistic)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Program.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetStatistic, {
            title: 'NewSetStatisticInProgram',
            exclude: ['id'],
            optional: ['programId']
          }),
        },
      },
    }) setStatistic: Omit<SetStatistic, 'id'>,
  ): Promise<SetStatistic> {
    return this.programRepository.setStatistics(id).create(setStatistic);
  }

  @patch('/programs/{id}/set-statistics', {
    responses: {
      '200': {
        description: 'Program.SetStatistic PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetStatistic, {partial: true}),
        },
      },
    })
    setStatistic: Partial<SetStatistic>,
    @param.query.object('where', getWhereSchemaFor(SetStatistic)) where?: Where<SetStatistic>,
  ): Promise<Count> {
    return this.programRepository.setStatistics(id).patch(setStatistic, where);
  }

  @del('/programs/{id}/set-statistics', {
    responses: {
      '200': {
        description: 'Program.SetStatistic DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(SetStatistic)) where?: Where<SetStatistic>,
  ): Promise<Count> {
    return this.programRepository.setStatistics(id).delete(where);
  }
}
