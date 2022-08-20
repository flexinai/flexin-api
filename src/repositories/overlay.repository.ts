import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Overlay, OverlayRelations} from '../models';

export class OverlayRepository extends DefaultCrudRepository<Overlay, typeof Overlay.prototype.id, OverlayRelations> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Overlay, dataSource);
  }
}
