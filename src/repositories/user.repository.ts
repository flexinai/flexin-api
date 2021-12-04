// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory, HasOneRepositoryFactory, repository
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Correction, User, UserCredentials, UserIdentity, Video} from '../models';
import {CorrectionRepository} from './correction.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserIdentityRepository} from './user-identity.repository';
import {VideoRepository} from './video.repository';

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

  public readonly correctionsCreated: HasManyRepositoryFactory<Correction, typeof User.prototype.id>;

  public readonly correctionsAssigned: HasManyRepositoryFactory<Correction, typeof User.prototype.id>;

  public readonly videosReviewed: HasManyRepositoryFactory<Video, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserIdentityRepository')
    protected profilesGetter: Getter<UserIdentityRepository>,
    @repository.getter('UserCredentialsRepository')
    protected credentialsGetter: Getter<UserCredentialsRepository>, @repository.getter('CorrectionRepository') protected correctionRepositoryGetter: Getter<CorrectionRepository>, @repository.getter('VideoRepository') protected videoRepositoryGetter: Getter<VideoRepository>,
  ) {
    super(User, dataSource);
    this.videosReviewed = this.createHasManyRepositoryFactoryFor('videosReviewed', videoRepositoryGetter,);
    this.registerInclusionResolver('videosReviewed', this.videosReviewed.inclusionResolver);
    this.correctionsAssigned = this.createHasManyRepositoryFactoryFor('correctionsAssigned', correctionRepositoryGetter,);
    this.registerInclusionResolver('correctionsAssigned', this.correctionsAssigned.inclusionResolver);
    this.correctionsCreated = this.createHasManyRepositoryFactoryFor('correctionsCreated', correctionRepositoryGetter,);
    this.registerInclusionResolver('correctionsCreated', this.correctionsCreated.inclusionResolver);
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
