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
import {SetStatistic} from '../models';
import {SetStatisticRepository} from '../repositories';

export class SetStatisticController {
  constructor(
    @repository(SetStatisticRepository)
    public setStatisticRepository : SetStatisticRepository,
  ) {}

  @post('/set-statistics', {
    responses: {
      '200': {
        description: 'SetStatistic model instance',
        content: {'application/json': {schema: getModelSchemaRef(SetStatistic)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetStatistic, {
            title: 'NewSetStatistic',
            exclude: ['id'],
          }),
        },
      },
    })
    setStatistic: Omit<SetStatistic, 'id'>,
  ): Promise<SetStatistic> {
    return this.setStatisticRepository.create(setStatistic);
  }

  @get('/set-statistics/count', {
    responses: {
      '200': {
        description: 'SetStatistic model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(SetStatistic) where?: Where<SetStatistic>,
  ): Promise<Count> {
    return this.setStatisticRepository.count(where);
  }

  @get('/set-statistics', {
    responses: {
      '200': {
        description: 'Array of SetStatistic model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(SetStatistic, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(SetStatistic) filter?: Filter<SetStatistic>,
  ): Promise<SetStatistic[]> {
    return this.setStatisticRepository.find(filter);
  }

  @patch('/set-statistics', {
    responses: {
      '200': {
        description: 'SetStatistic PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetStatistic, {partial: true}),
        },
      },
    })
    setStatistic: SetStatistic,
    @param.where(SetStatistic) where?: Where<SetStatistic>,
  ): Promise<Count> {
    return this.setStatisticRepository.updateAll(setStatistic, where);
  }

  @get('/set-statistics/{id}', {
    responses: {
      '200': {
        description: 'SetStatistic model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SetStatistic, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SetStatistic, {exclude: 'where'}) filter?: FilterExcludingWhere<SetStatistic>
  ): Promise<SetStatistic> {
    return this.setStatisticRepository.findById(id, filter);
  }

  @patch('/set-statistics/{id}', {
    responses: {
      '204': {
        description: 'SetStatistic PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetStatistic, {partial: true}),
        },
      },
    })
    setStatistic: SetStatistic,
  ): Promise<void> {
    await this.setStatisticRepository.updateById(id, setStatistic);
  }

  @put('/set-statistics/{id}', {
    responses: {
      '204': {
        description: 'SetStatistic PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() setStatistic: SetStatistic,
  ): Promise<void> {
    await this.setStatisticRepository.replaceById(id, setStatistic);
  }

  @del('/set-statistics/{id}', {
    responses: {
      '204': {
        description: 'SetStatistic DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.setStatisticRepository.deleteById(id);
  }
}
