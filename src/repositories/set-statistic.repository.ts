import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {SetStatistic, SetStatisticRelations, Workout, Program, Clip} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {WorkoutRepository} from './workout.repository';
import {ProgramRepository} from './program.repository';
import {ClipRepository} from './clip.repository';

export class SetStatisticRepository extends DefaultCrudRepository<
  SetStatistic,
  typeof SetStatistic.prototype.id,
  SetStatisticRelations
> {

  public readonly workout: BelongsToAccessor<Workout, typeof SetStatistic.prototype.id>;

  public readonly program: BelongsToAccessor<Program, typeof SetStatistic.prototype.id>;

  public readonly clip: HasOneRepositoryFactory<Clip, typeof SetStatistic.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('WorkoutRepository') protected workoutRepositoryGetter: Getter<WorkoutRepository>, @repository.getter('ProgramRepository') protected programRepositoryGetter: Getter<ProgramRepository>, @repository.getter('ClipRepository') protected clipRepositoryGetter: Getter<ClipRepository>,
  ) {
    super(SetStatistic, dataSource);
    this.clip = this.createHasOneRepositoryFactoryFor('clip', clipRepositoryGetter);
    this.registerInclusionResolver('clip', this.clip.inclusionResolver);
    this.program = this.createBelongsToAccessorFor('program', programRepositoryGetter,);
    this.registerInclusionResolver('program', this.program.inclusionResolver);
    this.workout = this.createBelongsToAccessorFor('workout', workoutRepositoryGetter,);
    this.registerInclusionResolver('workout', this.workout.inclusionResolver);
  }
}
