import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Annotation, Clip, ClipRelations, Video} from '../models';
import {AnnotationRepository} from './correction.repository';
import {VideoRepository} from './video.repository';

export class ClipRepository extends DefaultCrudRepository<
  Clip,
  typeof Clip.prototype.id,
  ClipRelations
> {

  public readonly annotations: HasManyRepositoryFactory<Annotation, typeof Clip.prototype.id>;

  public readonly video: BelongsToAccessor<Video, typeof Clip.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AnnotationRepository') protected annotationRepositoryGetter: Getter<AnnotationRepository>, @repository.getter('VideoRepository') protected videoRepositoryGetter: Getter<VideoRepository>,
  ) {
    super(Clip, dataSource);
    this.video = this.createBelongsToAccessorFor('video', videoRepositoryGetter,);
    this.registerInclusionResolver('video', this.video.inclusionResolver);
    this.annotations = this.createHasManyRepositoryFactoryFor('annotations', annotationRepositoryGetter,);
    this.registerInclusionResolver('annotations', this.annotations.inclusionResolver);
  }
}
