import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Annotation, AnnotationRelations, AnnotationNote} from '../models';
import {AnnotationNoteRepository} from './annotation-note.repository';

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
