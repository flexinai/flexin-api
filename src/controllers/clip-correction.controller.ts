import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {Clip, Correction} from '../models';
import {ClipRepository} from '../repositories';

export class ClipCorrectionController {
  constructor(
    @repository(ClipRepository) protected clipRepository: ClipRepository,
  ) {}

  @get('/clips/{id}/corrections', {
    responses: {
      '200': {
        description: 'Array of Clip has many Correction',
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
    return this.clipRepository.corrections(id).find(filter);
  }

  @post('/clips/{id}/corrections', {
    responses: {
      '200': {
        description: 'Clip model instance',
        content: {'application/json': {schema: getModelSchemaRef(Correction)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Clip.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Correction, {
            title: 'NewCorrectionInClip',
            exclude: ['id'],
            optional: ['clipId'],
          }),
        },
      },
    })
    correction: Omit<Correction, 'id'>,
  ): Promise<Correction> {
    return this.clipRepository.corrections(id).create(correction);
  }

  @patch('/clips/{id}/corrections', {
    responses: {
      '200': {
        description: 'Clip.Correction PATCH success count',
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
    return this.clipRepository.corrections(id).patch(correction, where);
  }

  @del('/clips/{id}/corrections', {
    responses: {
      '200': {
        description: 'Clip.Correction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Correction)) where?: Where<Correction>,
  ): Promise<Count> {
    return this.clipRepository.corrections(id).delete(where);
  }
}
