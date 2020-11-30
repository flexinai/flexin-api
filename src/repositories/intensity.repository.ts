import {DefaultCrudRepository} from '@loopback/repository';
import {Intensity, IntensityRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class IntensityRepository extends DefaultCrudRepository<
  Intensity,
  typeof Intensity.prototype.id,
  IntensityRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Intensity, dataSource);
  }
}
