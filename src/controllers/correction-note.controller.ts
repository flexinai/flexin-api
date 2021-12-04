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
import {CorrectionNote} from '../models';
import {CorrectionNoteRepository} from '../repositories';

export class CorrectionNoteController {
  constructor(
    @repository(CorrectionNoteRepository)
    public correctionNoteRepository : CorrectionNoteRepository,
  ) {}

  @post('/correction-notes')
  @response(200, {
    description: 'CorrectionNote model instance',
    content: {'application/json': {schema: getModelSchemaRef(CorrectionNote)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CorrectionNote, {
            title: 'NewCorrectionNote',
            exclude: ['id'],
          }),
        },
      },
    })
    correctionNote: Omit<CorrectionNote, 'id'>,
  ): Promise<CorrectionNote> {
    return this.correctionNoteRepository.create(correctionNote);
  }

  @get('/correction-notes/count')
  @response(200, {
    description: 'CorrectionNote model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CorrectionNote) where?: Where<CorrectionNote>,
  ): Promise<Count> {
    return this.correctionNoteRepository.count(where);
  }

  @get('/correction-notes')
  @response(200, {
    description: 'Array of CorrectionNote model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CorrectionNote, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CorrectionNote) filter?: Filter<CorrectionNote>,
  ): Promise<CorrectionNote[]> {
    return this.correctionNoteRepository.find(filter);
  }

  @patch('/correction-notes')
  @response(200, {
    description: 'CorrectionNote PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CorrectionNote, {partial: true}),
        },
      },
    })
    correctionNote: CorrectionNote,
    @param.where(CorrectionNote) where?: Where<CorrectionNote>,
  ): Promise<Count> {
    return this.correctionNoteRepository.updateAll(correctionNote, where);
  }

  @get('/correction-notes/{id}')
  @response(200, {
    description: 'CorrectionNote model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CorrectionNote, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CorrectionNote, {exclude: 'where'}) filter?: FilterExcludingWhere<CorrectionNote>
  ): Promise<CorrectionNote> {
    return this.correctionNoteRepository.findById(id, filter);
  }

  @patch('/correction-notes/{id}')
  @response(204, {
    description: 'CorrectionNote PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CorrectionNote, {partial: true}),
        },
      },
    })
    correctionNote: CorrectionNote,
  ): Promise<void> {
    await this.correctionNoteRepository.updateById(id, correctionNote);
  }

  @put('/correction-notes/{id}')
  @response(204, {
    description: 'CorrectionNote PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() correctionNote: CorrectionNote,
  ): Promise<void> {
    await this.correctionNoteRepository.replaceById(id, correctionNote);
  }

  @del('/correction-notes/{id}')
  @response(204, {
    description: 'CorrectionNote DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.correctionNoteRepository.deleteById(id);
  }
}
