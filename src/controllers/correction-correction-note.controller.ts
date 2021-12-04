import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Annotation,
  AnnotationNote,
} from '../models';
import {AnnotationRepository} from '../repositories';

export class AnnotationAnnotationNoteController {
  constructor(
    @repository(AnnotationRepository)
    public annotationRepository: AnnotationRepository,
  ) { }

  @get('/annotations/{id}/annotation-note', {
    responses: {
      '200': {
        description: 'AnnotationNote belonging to Annotation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(AnnotationNote)},
          },
        },
      },
    },
  })
  async getAnnotationNote(
    @param.path.number('id') id: typeof Annotation.prototype.id,
  ): Promise<AnnotationNote> {
    return this.annotationRepository.annotationNote(id);
  }
}
