import {DefaultCrudRepository} from '@loopback/repository';
import {Exercise, ExerciseRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ExerciseRepository extends DefaultCrudRepository<
  Exercise,
  typeof Exercise.prototype.id,
  ExerciseRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Exercise, dataSource);
  }
}
