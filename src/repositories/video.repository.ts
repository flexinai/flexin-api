import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Clip, Video, VideoRelations} from '../models';
import {ClipRepository} from './clip.repository';

export class VideoRepository extends DefaultCrudRepository<
  Video,
  typeof Video.prototype.id,
  VideoRelations
> {

  public readonly clips: HasManyRepositoryFactory<Clip, typeof Video.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ClipRepository') protected clipRepositoryGetter: Getter<ClipRepository>
  ) {
    super(Video, dataSource);
    this.clips = this.createHasManyRepositoryFactoryFor('clips', clipRepositoryGetter,);
    this.registerInclusionResolver('clips', this.clips.inclusionResolver);
  }
}
