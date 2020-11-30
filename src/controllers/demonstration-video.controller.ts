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
import {DemonstrationVideo} from '../models';
import {DemonstrationVideoRepository} from '../repositories';

export class DemonstrationVideoController {
  constructor(
    @repository(DemonstrationVideoRepository)
    public demonstrationVideoRepository : DemonstrationVideoRepository,
  ) {}

  @post('/demonstration-videos', {
    responses: {
      '200': {
        description: 'DemonstrationVideo model instance',
        content: {'application/json': {schema: getModelSchemaRef(DemonstrationVideo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemonstrationVideo, {
            title: 'NewDemonstrationVideo',
            exclude: ['id'],
          }),
        },
      },
    })
    demonstrationVideo: Omit<DemonstrationVideo, 'id'>,
  ): Promise<DemonstrationVideo> {
    return this.demonstrationVideoRepository.create(demonstrationVideo);
  }

  @get('/demonstration-videos/count', {
    responses: {
      '200': {
        description: 'DemonstrationVideo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(DemonstrationVideo) where?: Where<DemonstrationVideo>,
  ): Promise<Count> {
    return this.demonstrationVideoRepository.count(where);
  }

  @get('/demonstration-videos', {
    responses: {
      '200': {
        description: 'Array of DemonstrationVideo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DemonstrationVideo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(DemonstrationVideo) filter?: Filter<DemonstrationVideo>,
  ): Promise<DemonstrationVideo[]> {
    return this.demonstrationVideoRepository.find(filter);
  }

  @patch('/demonstration-videos', {
    responses: {
      '200': {
        description: 'DemonstrationVideo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemonstrationVideo, {partial: true}),
        },
      },
    })
    demonstrationVideo: DemonstrationVideo,
    @param.where(DemonstrationVideo) where?: Where<DemonstrationVideo>,
  ): Promise<Count> {
    return this.demonstrationVideoRepository.updateAll(demonstrationVideo, where);
  }

  @get('/demonstration-videos/{id}', {
    responses: {
      '200': {
        description: 'DemonstrationVideo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DemonstrationVideo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DemonstrationVideo, {exclude: 'where'}) filter?: FilterExcludingWhere<DemonstrationVideo>
  ): Promise<DemonstrationVideo> {
    return this.demonstrationVideoRepository.findById(id, filter);
  }

  @patch('/demonstration-videos/{id}', {
    responses: {
      '204': {
        description: 'DemonstrationVideo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemonstrationVideo, {partial: true}),
        },
      },
    })
    demonstrationVideo: DemonstrationVideo,
  ): Promise<void> {
    await this.demonstrationVideoRepository.updateById(id, demonstrationVideo);
  }

  @put('/demonstration-videos/{id}', {
    responses: {
      '204': {
        description: 'DemonstrationVideo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() demonstrationVideo: DemonstrationVideo,
  ): Promise<void> {
    await this.demonstrationVideoRepository.replaceById(id, demonstrationVideo);
  }

  @del('/demonstration-videos/{id}', {
    responses: {
      '204': {
        description: 'DemonstrationVideo DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.demonstrationVideoRepository.deleteById(id);
  }
}
