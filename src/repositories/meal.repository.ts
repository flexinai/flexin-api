import {DefaultCrudRepository} from '@loopback/repository';
import {Meal, MealRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MealRepository extends DefaultCrudRepository<
  Meal,
  typeof Meal.prototype.id,
  MealRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Meal, dataSource);
  }
}
