import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {Workout, WorkoutRelations, Program, Exercise, Set, Intensity, SetStatistic} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProgramRepository} from './program.repository';
import {ExerciseRepository} from './exercise.repository';
import {SetRepository} from './set.repository';
import {IntensityRepository} from './intensity.repository';
import {SetStatisticRepository} from './set-statistic.repository';

export class WorkoutRepository extends DefaultCrudRepository<
  Workout,
  typeof Workout.prototype.id,
  WorkoutRelations
> {

  public readonly program: BelongsToAccessor<Program, typeof Workout.prototype.id>;

  public readonly exercise: BelongsToAccessor<Exercise, typeof Workout.prototype.id>;

  public readonly sets: HasManyRepositoryFactory<Set, typeof Workout.prototype.id>;

  public readonly intensity: BelongsToAccessor<Intensity, typeof Workout.prototype.id>;

  public readonly setStatistics: HasManyRepositoryFactory<SetStatistic, typeof Workout.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProgramRepository') protected programRepositoryGetter: Getter<ProgramRepository>, @repository.getter('ExerciseRepository') protected exerciseRepositoryGetter: Getter<ExerciseRepository>, @repository.getter('SetRepository') protected setRepositoryGetter: Getter<SetRepository>, @repository.getter('IntensityRepository') protected intensityRepositoryGetter: Getter<IntensityRepository>, @repository.getter('SetStatisticRepository') protected setStatisticRepositoryGetter: Getter<SetStatisticRepository>,
  ) {
    super(Workout, dataSource);
    this.setStatistics = this.createHasManyRepositoryFactoryFor('setStatistics', setStatisticRepositoryGetter,);
    this.registerInclusionResolver('setStatistics', this.setStatistics.inclusionResolver);
    this.intensity = this.createBelongsToAccessorFor('intensity', intensityRepositoryGetter,);
    this.registerInclusionResolver('intensity', this.intensity.inclusionResolver);
    this.sets = this.createHasManyRepositoryFactoryFor('sets', setRepositoryGetter,);
    this.registerInclusionResolver('sets', this.sets.inclusionResolver);
    this.exercise = this.createBelongsToAccessorFor('exercise', exerciseRepositoryGetter,);
    this.registerInclusionResolver('exercise', this.exercise.inclusionResolver);
    this.program = this.createBelongsToAccessorFor('program', programRepositoryGetter,);
    this.registerInclusionResolver('program', this.program.inclusionResolver);
  }
}
