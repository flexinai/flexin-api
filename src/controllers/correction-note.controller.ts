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
  response,
} from '@loopback/rest';
import {AnnotationNote} from '../models';
import {AnnotationNoteRepository} from '../repositories';

export class AnnotationNoteController {
  constructor(
    @repository(AnnotationNoteRepository)
    public annotationNoteRepository : AnnotationNoteRepository,
  ) {}

  @post('/annotation-notes')
  @response(200, {
    description: 'AnnotationNote model instance',
    content: {'application/json': {schema: getModelSchemaRef(AnnotationNote)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AnnotationNote, {
            title: 'NewAnnotationNote',
            exclude: ['id'],
          }),
        },
      },
    })
    annotationNote: Omit<AnnotationNote, 'id'>,
  ): Promise<AnnotationNote> {
    return this.annotationNoteRepository.create(annotationNote);
  }

  @get('/annotation-notes/count')
  @response(200, {
    description: 'AnnotationNote model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AnnotationNote) where?: Where<AnnotationNote>,
  ): Promise<Count> {
    return this.annotationNoteRepository.count(where);
  }

  @get('/annotation-notes')
  @response(200, {
    description: 'Array of AnnotationNote model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AnnotationNote, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AnnotationNote) filter?: Filter<AnnotationNote>,
  ): Promise<AnnotationNote[]> {
    return this.annotationNoteRepository.find(filter);
  }

  @patch('/annotation-notes')
  @response(200, {
    description: 'AnnotationNote PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AnnotationNote, {partial: true}),
        },
      },
    })
    annotationNote: AnnotationNote,
    @param.where(AnnotationNote) where?: Where<AnnotationNote>,
  ): Promise<Count> {
    return this.annotationNoteRepository.updateAll(annotationNote, where);
  }

  @get('/annotation-notes/{id}')
  @response(200, {
    description: 'AnnotationNote model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AnnotationNote, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AnnotationNote, {exclude: 'where'}) filter?: FilterExcludingWhere<AnnotationNote>
  ): Promise<AnnotationNote> {
    return this.annotationNoteRepository.findById(id, filter);
  }

  @patch('/annotation-notes/{id}')
  @response(204, {
    description: 'AnnotationNote PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AnnotationNote, {partial: true}),
        },
      },
    })
    annotationNote: AnnotationNote,
  ): Promise<void> {
    await this.annotationNoteRepository.updateById(id, annotationNote);
  }

  @put('/annotation-notes/{id}')
  @response(204, {
    description: 'AnnotationNote PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() annotationNote: AnnotationNote,
  ): Promise<void> {
    await this.annotationNoteRepository.replaceById(id, annotationNote);
  }

  @del('/annotation-notes/{id}')
  @response(204, {
    description: 'AnnotationNote DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.annotationNoteRepository.deleteById(id);
  }
}
