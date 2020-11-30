import {DefaultCrudRepository} from '@loopback/repository';
import {SetStatistic, SetStatisticRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SetStatisticRepository extends DefaultCrudRepository<
  SetStatistic,
  typeof SetStatistic.prototype.id,
  SetStatisticRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(SetStatistic, dataSource);
  }
}
