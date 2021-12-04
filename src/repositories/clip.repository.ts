import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Clip, ClipRelations, Correction, Video} from '../models';
import {CorrectionRepository} from './correction.repository';
import {VideoRepository} from './video.repository';

export class ClipRepository extends DefaultCrudRepository<
  Clip,
  typeof Clip.prototype.id,
  ClipRelations
> {

  public readonly corrections: HasManyRepositoryFactory<Correction, typeof Clip.prototype.id>;

  public readonly video: BelongsToAccessor<Video, typeof Clip.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CorrectionRepository') protected correctionRepositoryGetter: Getter<CorrectionRepository>, @repository.getter('VideoRepository') protected videoRepositoryGetter: Getter<VideoRepository>,
  ) {
    super(Clip, dataSource);
    this.video = this.createBelongsToAccessorFor('video', videoRepositoryGetter,);
    this.registerInclusionResolver('video', this.video.inclusionResolver);
    this.corrections = this.createHasManyRepositoryFactoryFor('corrections', correctionRepositoryGetter,);
    this.registerInclusionResolver('corrections', this.corrections.inclusionResolver);
  }
}
