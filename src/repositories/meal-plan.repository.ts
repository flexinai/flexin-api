import {DefaultCrudRepository} from '@loopback/repository';
import {MealPlan, MealPlanRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MealPlanRepository extends DefaultCrudRepository<
  MealPlan,
  typeof MealPlan.prototype.id,
  MealPlanRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(MealPlan, dataSource);
  }
}
