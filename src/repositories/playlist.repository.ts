import {DefaultCrudRepository} from '@loopback/repository';
import {Playlist, PlaylistRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PlaylistRepository extends DefaultCrudRepository<
  Playlist,
  typeof Playlist.prototype.id,
  PlaylistRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Playlist, dataSource);
  }
}
