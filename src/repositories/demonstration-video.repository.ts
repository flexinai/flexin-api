import {DefaultCrudRepository} from '@loopback/repository';
import {DemonstrationVideo, DemonstrationVideoRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

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
