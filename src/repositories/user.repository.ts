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
import {User, UserCredentials, UserIdentity, Annotation, Video} from '../models';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserIdentityRepository} from './user-identity.repository';
import {AnnotationRepository} from './annotation.repository';
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

  public readonly annotationsCreated: HasManyRepositoryFactory<Annotation, typeof User.prototype.id>;

  public readonly annotationsAssigned: HasManyRepositoryFactory<Annotation, typeof User.prototype.id>;

  public readonly videosReviewed: HasManyRepositoryFactory<Video, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserIdentityRepository')
    protected profilesGetter: Getter<UserIdentityRepository>,
    @repository.getter('UserCredentialsRepository')
    protected credentialsGetter: Getter<UserCredentialsRepository>, @repository.getter('AnnotationRepository') protected annotationRepositoryGetter: Getter<AnnotationRepository>, @repository.getter('VideoRepository') protected videoRepositoryGetter: Getter<VideoRepository>,
  ) {
    super(User, dataSource);
    this.videosReviewed = this.createHasManyRepositoryFactoryFor('videosReviewed', videoRepositoryGetter,);
    this.registerInclusionResolver('videosReviewed', this.videosReviewed.inclusionResolver);
    this.annotationsAssigned = this.createHasManyRepositoryFactoryFor('annotationsAssigned', annotationRepositoryGetter,);
    this.registerInclusionResolver('annotationsAssigned', this.annotationsAssigned.inclusionResolver);
    this.annotationsCreated = this.createHasManyRepositoryFactoryFor('annotationsCreated', annotationRepositoryGetter,);
    this.registerInclusionResolver('annotationsCreated', this.annotationsCreated.inclusionResolver);
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
