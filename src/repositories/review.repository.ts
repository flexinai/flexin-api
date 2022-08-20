import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {CorrectionRepository, OverlayRepository} from '.';
import {DbDataSource} from '../datasources';
import {Correction, Overlay, Review, ReviewRelations} from '../models';

export class ReviewRepository extends DefaultCrudRepository<Review, typeof Review.prototype.id, ReviewRelations> {
  public readonly overlays: HasManyRepositoryFactory<Overlay, typeof Review.prototype.id>;
  public readonly corrections: HasManyRepositoryFactory<Correction, typeof Review.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('OverlayRepository') protected overlayRepositoryGetter: Getter<OverlayRepository>,
    @repository.getter('CorrectionRepository') protected correctionRepositoryGetter: Getter<CorrectionRepository>,
  ) {
    super(Review, dataSource);
    this.overlays = this.createHasManyRepositoryFactoryFor('overlays', overlayRepositoryGetter);
    this.corrections = this.createHasManyRepositoryFactoryFor('corrections', correctionRepositoryGetter);
    this.registerInclusionResolver('overlays', this.overlays.inclusionResolver);
    this.registerInclusionResolver('corrections', this.corrections.inclusionResolver);
  }
}
