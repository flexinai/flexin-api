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
import {Clip} from '../models';
import {ClipRepository} from '../repositories';

export class ClipController {
  constructor(
    @repository(ClipRepository)
    public clipRepository : ClipRepository,
  ) {}

  @post('/clips', {
    responses: {
      '200': {
        description: 'Clip model instance',
        content: {'application/json': {schema: getModelSchemaRef(Clip)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {
            title: 'NewClip',
            exclude: ['id'],
          }),
        },
      },
    })
    clip: Omit<Clip, 'id'>,
  ): Promise<Clip> {
    return this.clipRepository.create(clip);
  }

  @get('/clips/count', {
    responses: {
      '200': {
        description: 'Clip model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Clip) where?: Where<Clip>,
  ): Promise<Count> {
    return this.clipRepository.count(where);
  }

  @get('/clips', {
    responses: {
      '200': {
        description: 'Array of Clip model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Clip, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Clip) filter?: Filter<Clip>,
  ): Promise<Clip[]> {
    return this.clipRepository.find(filter);
  }

  @patch('/clips', {
    responses: {
      '200': {
        description: 'Clip PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {partial: true}),
        },
      },
    })
    clip: Clip,
    @param.where(Clip) where?: Where<Clip>,
  ): Promise<Count> {
    return this.clipRepository.updateAll(clip, where);
  }

  @get('/clips/{id}', {
    responses: {
      '200': {
        description: 'Clip model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Clip, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Clip, {exclude: 'where'}) filter?: FilterExcludingWhere<Clip>
  ): Promise<Clip> {
    return this.clipRepository.findById(id, filter);
  }

  @patch('/clips/{id}', {
    responses: {
      '204': {
        description: 'Clip PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clip, {partial: true}),
        },
      },
    })
    clip: Clip,
  ): Promise<void> {
    await this.clipRepository.updateById(id, clip);
  }

  @put('/clips/{id}', {
    responses: {
      '204': {
        description: 'Clip PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() clip: Clip,
  ): Promise<void> {
    await this.clipRepository.replaceById(id, clip);
  }

  @del('/clips/{id}', {
    responses: {
      '204': {
        description: 'Clip DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.clipRepository.deleteById(id);
  }
}
