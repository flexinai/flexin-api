import {DefaultCrudRepository} from '@loopback/repository';
import {Workout, WorkoutRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class WorkoutRepository extends DefaultCrudRepository<
  Workout,
  typeof Workout.prototype.id,
  WorkoutRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Workout, dataSource);
  }
}
