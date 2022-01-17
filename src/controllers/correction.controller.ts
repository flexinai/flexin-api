import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Correction} from '../models';
import {ClipRepository, CorrectionRepository} from '../repositories';

export class CorrectionController {
  constructor(
    @repository(CorrectionRepository)
    public correctionRepository: CorrectionRepository,
    @repository(ClipRepository)
    protected clipRepository: ClipRepository,
  ) {}

  @post('/corrections')
  @response(200, {
    description: 'Correction model instance',
    content: {'application/json': {schema: getModelSchemaRef(Correction)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Correction, {
            title: 'NewCorrection',
            exclude: ['id'],
          }),
        },
      },
    })
    correction: Omit<Correction, 'id'>,
  ): Promise<Correction> {
    return this.correctionRepository.create(correction);
  }

  @get('/corrections/count')
  @response(200, {
    description: 'Correction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Correction) where?: Where<Correction>): Promise<Count> {
    return this.correctionRepository.count(where);
  }

  @get('/corrections')
  @response(200, {
    description: 'Array of Correction model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Correction, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Correction) filter?: Filter<Correction>): Promise<Correction[]> {
    return this.correctionRepository.find(filter);
  }

  @patch('/corrections')
  @response(200, {
    description: 'Correction PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Correction, {partial: true}),
        },
      },
    })
    correction: Correction,
    @param.where(Correction) where?: Where<Correction>,
  ): Promise<Count> {
    return this.correctionRepository.updateAll(correction, where);
  }

  @get('/corrections/{id}')
  @response(200, {
    description: 'Correction model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Correction, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Correction, {exclude: 'where'}) filter?: FilterExcludingWhere<Correction>,
  ): Promise<Correction> {
    return this.correctionRepository.findById(id, filter);
  }

  @patch('/corrections/{id}')
  @response(204, {
    description: 'Correction PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Correction, {partial: true}),
        },
      },
    })
    correction: Correction,
  ): Promise<void> {
    await this.correctionRepository.updateById(id, correction);
  }

  @put('/corrections/{id}')
  @response(204, {
    description: 'Correction PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() correction: Correction): Promise<void> {
    await this.correctionRepository.replaceById(id, correction);
  }

  @del('/corrections/{id}')
  @response(204, {
    description: 'Correction DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.correctionRepository.deleteById(id);
  }
}
