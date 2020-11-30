import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Intensity, IntensityRelations, Exercise, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ExerciseRepository} from './exercise.repository';
import {UserRepository} from './user.repository';

export class IntensityRepository extends DefaultCrudRepository<
  Intensity,
  typeof Intensity.prototype.id,
  IntensityRelations
> {

  public readonly exercise: BelongsToAccessor<Exercise, typeof Intensity.prototype.id>;

  public readonly createdBy: BelongsToAccessor<User, typeof Intensity.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ExerciseRepository') protected exerciseRepositoryGetter: Getter<ExerciseRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Intensity, dataSource);
    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter,);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
    this.exercise = this.createBelongsToAccessorFor('exercise', exerciseRepositoryGetter,);
    this.registerInclusionResolver('exercise', this.exercise.inclusionResolver);
  }
}
