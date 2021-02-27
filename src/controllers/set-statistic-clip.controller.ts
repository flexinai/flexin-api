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
  SetStatistic,
  Clip,
} from '../models';
import {SetStatisticRepository} from '../repositories';

export class SetStatisticClipController {
  constructor(
    @repository(SetStatisticRepository) protected setStatisticRepository: SetStatisticRepository,
  ) { }

  @get('/set-statistics/{id}/clip', {
    responses: {
      '200': {
        description: 'SetStatistic has one Clip',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Clip),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Clip>,
  ): Promise<Clip> {
    return this.setStatisticRepository.clip(id).get(filter);
  }

  @post('/set-statistics/{id}/clip', {
    responses: {
      '200': {
        description: 'SetStatistic model instance',
        content: {'application/json': {schema: getModelSchemaRef(Clip)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof SetStatistic.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {
            title: 'NewClipInSetStatistic',
            exclude: ['id'],
            optional: ['setStatisticId']
          }),
        },
      },
    }) clip: Omit<Clip, 'id'>,
  ): Promise<Clip> {
    return this.setStatisticRepository.clip(id).create(clip);
  }

  @patch('/set-statistics/{id}/clip', {
    responses: {
      '200': {
        description: 'SetStatistic.Clip PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {partial: true}),
        },
      },
    })
    clip: Partial<Clip>,
    @param.query.object('where', getWhereSchemaFor(Clip)) where?: Where<Clip>,
  ): Promise<Count> {
    return this.setStatisticRepository.clip(id).patch(clip, where);
  }

  @del('/set-statistics/{id}/clip', {
    responses: {
      '200': {
        description: 'SetStatistic.Clip DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Clip)) where?: Where<Clip>,
  ): Promise<Count> {
    return this.setStatisticRepository.clip(id).delete(where);
  }
}
