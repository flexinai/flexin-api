import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  BelongsToAccessor,
} from '@loopback/repository';
import {Program, ProgramRelations, Workout, SetStatistic, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {WorkoutRepository} from './workout.repository';
import {SetStatisticRepository} from './set-statistic.repository';
import {UserRepository} from './user.repository';

export class ProgramRepository extends DefaultCrudRepository<Program, typeof Program.prototype.id, ProgramRelations> {
  public readonly workouts: HasManyRepositoryFactory<Workout, typeof Program.prototype.id>;

  public readonly setStatistics: HasManyRepositoryFactory<SetStatistic, typeof Program.prototype.id>;

  public readonly createdBy: BelongsToAccessor<User, typeof Program.prototype.id>;

  public readonly assignedTo: BelongsToAccessor<User, typeof Program.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('WorkoutRepository') protected workoutRepositoryGetter: Getter<WorkoutRepository>,
    @repository.getter('SetStatisticRepository') protected setStatisticRepositoryGetter: Getter<SetStatisticRepository>,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Program, dataSource);
    this.assignedTo = this.createBelongsToAccessorFor('assignedTo', userRepositoryGetter);
    this.registerInclusionResolver('assignedTo', this.assignedTo.inclusionResolver);
    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
    this.setStatistics = this.createHasManyRepositoryFactoryFor('setStatistics', setStatisticRepositoryGetter);
    this.registerInclusionResolver('setStatistics', this.setStatistics.inclusionResolver);
    this.workouts = this.createHasManyRepositoryFactoryFor('workouts', workoutRepositoryGetter);
    this.registerInclusionResolver('workouts', this.workouts.inclusionResolver);
  }
}
