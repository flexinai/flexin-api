import {DefaultCrudRepository} from '@loopback/repository';
import {Food, FoodRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FoodRepository extends DefaultCrudRepository<
  Food,
  typeof Food.prototype.id,
  FoodRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Food, dataSource);
  }
}
