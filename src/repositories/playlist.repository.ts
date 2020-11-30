import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Playlist, PlaylistRelations, Program} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProgramRepository} from './program.repository';

export class PlaylistRepository extends DefaultCrudRepository<
  Playlist,
  typeof Playlist.prototype.id,
  PlaylistRelations
> {

  public readonly program: BelongsToAccessor<Program, typeof Playlist.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProgramRepository') protected programRepositoryGetter: Getter<ProgramRepository>,
  ) {
    super(Playlist, dataSource);
    this.program = this.createBelongsToAccessorFor('program', programRepositoryGetter,);
    this.registerInclusionResolver('program', this.program.inclusionResolver);
  }
}
