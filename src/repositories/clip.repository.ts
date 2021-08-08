import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Clip, ClipRelations} from '../models';

export class ClipRepository extends DefaultCrudRepository<
  Clip,
  typeof Clip.prototype.id,
  ClipRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Clip, dataSource);
  }
}
