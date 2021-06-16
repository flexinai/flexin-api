import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Clip, ClipRelations, SetStatistic, WorkoutVideo} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SetStatisticRepository} from './set-statistic.repository';
import {WorkoutVideoRepository} from './workout-video.repository';

export class ClipRepository extends DefaultCrudRepository<
  Clip,
  typeof Clip.prototype.id,
  ClipRelations
> {

  public readonly setStatistic: BelongsToAccessor<SetStatistic, typeof Clip.prototype.id>;

  public readonly workoutVideo: BelongsToAccessor<WorkoutVideo, typeof Clip.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SetStatisticRepository') protected setStatisticRepositoryGetter: Getter<SetStatisticRepository>, @repository.getter('WorkoutVideoRepository') protected workoutVideoRepositoryGetter: Getter<WorkoutVideoRepository>,
  ) {
    super(Clip, dataSource);
    this.workoutVideo = this.createBelongsToAccessorFor('workoutVideo', workoutVideoRepositoryGetter,);
    this.registerInclusionResolver('workoutVideo', this.workoutVideo.inclusionResolver);
    this.setStatistic = this.createBelongsToAccessorFor('setStatistic', setStatisticRepositoryGetter,);
    this.registerInclusionResolver('setStatistic', this.setStatistic.inclusionResolver);
  }
}
