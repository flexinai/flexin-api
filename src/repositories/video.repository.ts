import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Video, VideoRelations, Clip, User} from '../models';
import {ClipRepository} from './clip.repository';
import {UserRepository} from './user.repository';

export class VideoRepository extends DefaultCrudRepository<
  Video,
  typeof Video.prototype.id,
  VideoRelations
> {

  public readonly clips: HasManyRepositoryFactory<Clip, typeof Video.prototype.id>;

  public readonly reviewedBy: BelongsToAccessor<User, typeof Video.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ClipRepository') protected clipRepositoryGetter: Getter<ClipRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Video, dataSource);
    this.reviewedBy = this.createBelongsToAccessorFor('reviewedBy', userRepositoryGetter,);
    this.registerInclusionResolver('reviewedBy', this.reviewedBy.inclusionResolver);
    this.clips = this.createHasManyRepositoryFactoryFor('clips', clipRepositoryGetter,);
    this.registerInclusionResolver('clips', this.clips.inclusionResolver);
  }
}
