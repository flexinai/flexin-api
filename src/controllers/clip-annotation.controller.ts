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
  Clip,
  Annotation,
} from '../models';
import {ClipRepository} from '../repositories';

export class ClipAnnotationController {
  constructor(
    @repository(ClipRepository) protected clipRepository: ClipRepository,
  ) { }

  @get('/clips/{id}/annotations', {
    responses: {
      '200': {
        description: 'Array of Clip has many Annotation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Annotation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Annotation>,
  ): Promise<Annotation[]> {
    return this.clipRepository.annotations(id).find(filter);
  }

  @post('/clips/{id}/annotations', {
    responses: {
      '200': {
        description: 'Clip model instance',
        content: {'application/json': {schema: getModelSchemaRef(Annotation)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Clip.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Annotation, {
            title: 'NewAnnotationInClip',
            exclude: ['id'],
            optional: ['clipId']
          }),
        },
      },
    }) annotation: Omit<Annotation, 'id'>,
  ): Promise<Annotation> {
    return this.clipRepository.annotations(id).create(annotation);
  }

  @patch('/clips/{id}/annotations', {
    responses: {
      '200': {
        description: 'Clip.Annotation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Annotation, {partial: true}),
        },
      },
    })
    annotation: Partial<Annotation>,
    @param.query.object('where', getWhereSchemaFor(Annotation)) where?: Where<Annotation>,
  ): Promise<Count> {
    return this.clipRepository.annotations(id).patch(annotation, where);
  }

  @del('/clips/{id}/annotations', {
    responses: {
      '200': {
        description: 'Clip.Annotation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Annotation)) where?: Where<Annotation>,
  ): Promise<Count> {
    return this.clipRepository.annotations(id).delete(where);
  }
}
