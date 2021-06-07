import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {WorkoutVideo, WorkoutVideoRelations} from '../models';

export class WorkoutVideoRepository extends DefaultCrudRepository<
  WorkoutVideo,
  typeof WorkoutVideo.prototype.id,
  WorkoutVideoRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(WorkoutVideo, dataSource);
  }
}
