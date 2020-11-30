import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {SetStatistic, SetStatisticRelations, Workout, Program} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {WorkoutRepository} from './workout.repository';
import {ProgramRepository} from './program.repository';

export class SetStatisticRepository extends DefaultCrudRepository<
  SetStatistic,
  typeof SetStatistic.prototype.id,
  SetStatisticRelations
> {

  public readonly workout: BelongsToAccessor<Workout, typeof SetStatistic.prototype.id>;

  public readonly program: BelongsToAccessor<Program, typeof SetStatistic.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('WorkoutRepository') protected workoutRepositoryGetter: Getter<WorkoutRepository>, @repository.getter('ProgramRepository') protected programRepositoryGetter: Getter<ProgramRepository>,
  ) {
    super(SetStatistic, dataSource);
    this.program = this.createBelongsToAccessorFor('program', programRepositoryGetter,);
    this.registerInclusionResolver('program', this.program.inclusionResolver);
    this.workout = this.createBelongsToAccessorFor('workout', workoutRepositoryGetter,);
    this.registerInclusionResolver('workout', this.workout.inclusionResolver);
  }
}
