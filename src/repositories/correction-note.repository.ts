import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AnnotationNote, AnnotationNoteRelations} from '../models';

export class AnnotationNoteRepository extends DefaultCrudRepository<
  AnnotationNote,
  typeof AnnotationNote.prototype.id,
  AnnotationNoteRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(AnnotationNote, dataSource);
  }
}
