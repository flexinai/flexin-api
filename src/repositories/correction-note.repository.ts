import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CorrectionNote, CorrectionNoteRelations} from '../models';

export class CorrectionNoteRepository extends DefaultCrudRepository<
  CorrectionNote,
  typeof CorrectionNote.prototype.id,
  CorrectionNoteRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(CorrectionNote, dataSource);
  }
}
