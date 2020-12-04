import {DefaultCrudRepository} from '@loopback/repository';
import {ExerciseCategory, ExerciseCategoryRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ExerciseCategoryRepository extends DefaultCrudRepository<
  ExerciseCategory,
  typeof ExerciseCategory.prototype.id,
  ExerciseCategoryRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ExerciseCategory, dataSource);
  }
}
