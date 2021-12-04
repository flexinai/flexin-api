import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Annotation, AnnotationNote, AnnotationRelations} from '../models';
import {AnnotationNoteRepository} from './correction-note.repository';

export class AnnotationRepository extends DefaultCrudRepository<
  Annotation,
  typeof Annotation.prototype.id,
  AnnotationRelations
> {

  public readonly annotationNote: BelongsToAccessor<AnnotationNote, typeof Annotation.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AnnotationNoteRepository') protected annotationNoteRepositoryGetter: Getter<AnnotationNoteRepository>,
  ) {
    super(Annotation, dataSource);
    this.annotationNote = this.createBelongsToAccessorFor('annotationNote', annotationNoteRepositoryGetter,);
    this.registerInclusionResolver('annotationNote', this.annotationNote.inclusionResolver);
  }
}
