// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
  HasOneRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserIdentity, UserCredentials, Program, UserProgram} from '../models';
import {UserIdentityRepository} from './user-identity.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserProgramRepository} from './user-program.repository';
import {ProgramRepository} from './program.repository';

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

  public readonly programs: HasManyThroughRepositoryFactory<Program, typeof Program.prototype.id,
          UserProgram,
          typeof User.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserIdentityRepository')
    protected profilesGetter: Getter<UserIdentityRepository>,
    @repository.getter('UserCredentialsRepository')
    protected credentialsGetter: Getter<UserCredentialsRepository>, @repository.getter('UserProgramRepository') protected userProgramRepositoryGetter: Getter<UserProgramRepository>, @repository.getter('ProgramRepository') protected programRepositoryGetter: Getter<ProgramRepository>,
  ) {
    super(User, dataSource);
    this.programs = this.createHasManyThroughRepositoryFactoryFor('programs', programRepositoryGetter, userProgramRepositoryGetter,);
    this.registerInclusionResolver('programs', this.programs.inclusionResolver);
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
