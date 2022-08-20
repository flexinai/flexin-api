import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Correction, CorrectionNote} from '../models';
import {CorrectionRepository} from '../repositories';

export class CorrectionCorrectionNoteController {
  constructor(
    @repository(CorrectionRepository)
    public correctionRepository: CorrectionRepository,
  ) {}

  @get('/corrections/{id}/correction-note', {
    responses: {
      '200': {
        description: 'CorrectionNote belonging to Correction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CorrectionNote)},
          },
        },
      },
    },
  })
  async getCorrectionNote(@param.path.number('id') id: typeof Correction.prototype.id): Promise<CorrectionNote> {
    return this.correctionRepository.correctionNote(id);
  }
}
