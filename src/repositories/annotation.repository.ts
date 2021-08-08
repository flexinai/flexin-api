import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Annotation, AnnotationRelations} from '../models';

export class AnnotationRepository extends DefaultCrudRepository<
  Annotation,
  typeof Annotation.prototype.id,
  AnnotationRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Annotation, dataSource);
  }
}
