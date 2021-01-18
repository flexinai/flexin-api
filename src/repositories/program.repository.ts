import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {Program, ProgramRelations, Workout, SetStatistic, Playlist, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {WorkoutRepository} from './workout.repository';
import {SetStatisticRepository} from './set-statistic.repository';
import {PlaylistRepository} from './playlist.repository';
import {UserRepository} from './user.repository';

export class ProgramRepository extends DefaultCrudRepository<Program, typeof Program.prototype.id, ProgramRelations> {
  public readonly workouts: HasManyRepositoryFactory<Workout, typeof Program.prototype.id>;

  public readonly setStatistics: HasManyRepositoryFactory<SetStatistic, typeof Program.prototype.id>;

  public readonly playlist: HasOneRepositoryFactory<Playlist, typeof Program.prototype.id>;

  public readonly createdBy: BelongsToAccessor<User, typeof Program.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('WorkoutRepository') protected workoutRepositoryGetter: Getter<WorkoutRepository>,
    @repository.getter('SetStatisticRepository') protected setStatisticRepositoryGetter: Getter<SetStatisticRepository>,
    @repository.getter('PlaylistRepository') protected playlistRepositoryGetter: Getter<PlaylistRepository>,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Program, dataSource);
    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
    this.playlist = this.createHasOneRepositoryFactoryFor('playlist', playlistRepositoryGetter);
    this.registerInclusionResolver('playlist', this.playlist.inclusionResolver);
    this.setStatistics = this.createHasManyRepositoryFactoryFor('setStatistics', setStatisticRepositoryGetter);
    this.registerInclusionResolver('setStatistics', this.setStatistics.inclusionResolver);
    this.workouts = this.createHasManyRepositoryFactoryFor('workouts', workoutRepositoryGetter);
    this.registerInclusionResolver('workouts', this.workouts.inclusionResolver);
  }
}
