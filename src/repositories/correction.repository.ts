import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Correction, CorrectionNote, CorrectionRelations} from '../models';
import {CorrectionNoteRepository} from './correction-note.repository';

export class CorrectionRepository extends DefaultCrudRepository<
  Correction,
  typeof Correction.prototype.id,
  CorrectionRelations
> {

  public readonly correctionNote: BelongsToAccessor<CorrectionNote, typeof Correction.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CorrectionNoteRepository') protected correctionNoteRepositoryGetter: Getter<CorrectionNoteRepository>,
  ) {
    super(Correction, dataSource);
    this.correctionNote = this.createBelongsToAccessorFor('correctionNote', correctionNoteRepositoryGetter,);
    this.registerInclusionResolver('correctionNote', this.correctionNote.inclusionResolver);
  }
}
