import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {CorrectionRepository, OverlayRepository} from '.';
import {DbDataSource} from '../datasources';
import {Correction, Overlay, Video, VideoRelations} from '../models';


export class VideoRepository extends DefaultCrudRepository<
  Video,
  typeof Video.prototype.id,
  VideoRelations
> {

  public readonly overlays: HasManyRepositoryFactory<Overlay, typeof Video.prototype.id>;
  public readonly corrections: HasManyRepositoryFactory<Correction, typeof Video.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('OverlayRepository') protected overlayRepositoryGetter: Getter<OverlayRepository>,
    @repository.getter('CorrectionRepository') protected correctionRepositoryGetter: Getter<CorrectionRepository>
  ) {
    super(Video, dataSource);
    this.overlays = this.createHasManyRepositoryFactoryFor('overlays', overlayRepositoryGetter,);
    this.corrections = this.createHasManyRepositoryFactoryFor('corrections', correctionRepositoryGetter,);
    this.registerInclusionResolver('overlays', this.overlays.inclusionResolver);
    this.registerInclusionResolver('corrections', this.corrections.inclusionResolver);
  }
}
