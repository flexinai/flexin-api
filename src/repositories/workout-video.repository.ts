import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {WorkoutVideo, WorkoutVideoRelations, Clip} from '../models';
import {ClipRepository} from './clip.repository';

export class WorkoutVideoRepository extends DefaultCrudRepository<
  WorkoutVideo,
  typeof WorkoutVideo.prototype.id,
  WorkoutVideoRelations
> {

  public readonly clips: HasManyRepositoryFactory<Clip, typeof WorkoutVideo.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ClipRepository') protected clipRepositoryGetter: Getter<ClipRepository>,
  ) {
    super(WorkoutVideo, dataSource);
    this.clips = this.createHasManyRepositoryFactoryFor('clips', clipRepositoryGetter,);
    this.registerInclusionResolver('clips', this.clips.inclusionResolver);
  }
}
