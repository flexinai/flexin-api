import {DefaultCrudRepository} from '@loopback/repository';
import {Set, SetRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SetRepository extends DefaultCrudRepository<
  Set,
  typeof Set.prototype.id,
  SetRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Set, dataSource);
  }
}
