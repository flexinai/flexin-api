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
import {Intensity} from '../models';
import {IntensityRepository} from '../repositories';

export class IntensityController {
  constructor(
    @repository(IntensityRepository)
    public intensityRepository : IntensityRepository,
  ) {}

  @post('/intensities', {
    responses: {
      '200': {
        description: 'Intensity model instance',
        content: {'application/json': {schema: getModelSchemaRef(Intensity)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intensity, {
            title: 'NewIntensity',
            exclude: ['id'],
          }),
        },
      },
    })
    intensity: Omit<Intensity, 'id'>,
  ): Promise<Intensity> {
    return this.intensityRepository.create(intensity);
  }

  @get('/intensities/count', {
    responses: {
      '200': {
        description: 'Intensity model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Intensity) where?: Where<Intensity>,
  ): Promise<Count> {
    return this.intensityRepository.count(where);
  }

  @get('/intensities', {
    responses: {
      '200': {
        description: 'Array of Intensity model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Intensity, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Intensity) filter?: Filter<Intensity>,
  ): Promise<Intensity[]> {
    return this.intensityRepository.find(filter);
  }

  @patch('/intensities', {
    responses: {
      '200': {
        description: 'Intensity PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intensity, {partial: true}),
        },
      },
    })
    intensity: Intensity,
    @param.where(Intensity) where?: Where<Intensity>,
  ): Promise<Count> {
    return this.intensityRepository.updateAll(intensity, where);
  }

  @get('/intensities/{id}', {
    responses: {
      '200': {
        description: 'Intensity model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Intensity, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Intensity, {exclude: 'where'}) filter?: FilterExcludingWhere<Intensity>
  ): Promise<Intensity> {
    return this.intensityRepository.findById(id, filter);
  }

  @patch('/intensities/{id}', {
    responses: {
      '204': {
        description: 'Intensity PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intensity, {partial: true}),
        },
      },
    })
    intensity: Intensity,
  ): Promise<void> {
    await this.intensityRepository.updateById(id, intensity);
  }

  @put('/intensities/{id}', {
    responses: {
      '204': {
        description: 'Intensity PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() intensity: Intensity,
  ): Promise<void> {
    await this.intensityRepository.replaceById(id, intensity);
  }

  @del('/intensities/{id}', {
    responses: {
      '204': {
        description: 'Intensity DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.intensityRepository.deleteById(id);
  }
}
