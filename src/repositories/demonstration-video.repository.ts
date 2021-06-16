import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {DemonstrationVideo, DemonstrationVideoRelations} from '../models';

export class DemonstrationVideoRepository extends DefaultCrudRepository<
  DemonstrationVideo,
  typeof DemonstrationVideo.prototype.id,
  DemonstrationVideoRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DemonstrationVideo, dataSource);
  }
}
