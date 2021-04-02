// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
  HasOneRepositoryFactory,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserIdentity, UserCredentials, Category, Exercise, Intensity} from '../models';
import {UserIdentityRepository} from './user-identity.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {CategoryRepository} from './category.repository';
import {ExerciseRepository} from './exercise.repository';
import {IntensityRepository} from './intensity.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  public readonly profiles: HasManyRepositoryFactory<
    UserIdentity,
    typeof User.prototype.id
  >;

  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  public readonly categoriesCreated: HasManyRepositoryFactory<Category, typeof User.prototype.id>;

  public readonly exercisesCreated: HasManyRepositoryFactory<Exercise, typeof User.prototype.id>;

  public readonly intensitiesCreated: HasManyRepositoryFactory<Intensity, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserIdentityRepository')
    protected profilesGetter: Getter<UserIdentityRepository>,
    @repository.getter('UserCredentialsRepository')
    protected credentialsGetter: Getter<UserCredentialsRepository>, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('ExerciseRepository') protected exerciseRepositoryGetter: Getter<ExerciseRepository>, @repository.getter('IntensityRepository') protected intensityRepositoryGetter: Getter<IntensityRepository>,
  ) {
    super(User, dataSource);
    this.intensitiesCreated = this.createHasManyRepositoryFactoryFor('intensitiesCreated', intensityRepositoryGetter,);
    this.registerInclusionResolver('intensitiesCreated', this.intensitiesCreated.inclusionResolver);
    this.exercisesCreated = this.createHasManyRepositoryFactoryFor('exercisesCreated', exerciseRepositoryGetter,);
    this.registerInclusionResolver('exercisesCreated', this.exercisesCreated.inclusionResolver);
    this.categoriesCreated = this.createHasManyRepositoryFactoryFor('categoriesCreated', categoryRepositoryGetter,);
    this.registerInclusionResolver('categoriesCreated', this.categoriesCreated.inclusionResolver);
    this.profiles = this.createHasManyRepositoryFactoryFor(
      'profiles',
      profilesGetter,
    );
    this.registerInclusionResolver('profiles', this.profiles.inclusionResolver);

    this.credentials = this.createHasOneRepositoryFactoryFor(
      'credentials',
      credentialsGetter,
    );
    this.registerInclusionResolver(
      'credentials',
      this.credentials.inclusionResolver,
    );
  }
}
