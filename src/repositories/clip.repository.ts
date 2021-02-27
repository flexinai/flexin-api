import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Clip, ClipRelations, SetStatistic} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SetStatisticRepository} from './set-statistic.repository';

export class ClipRepository extends DefaultCrudRepository<
  Clip,
  typeof Clip.prototype.id,
  ClipRelations
> {

  public readonly setStatistic: BelongsToAccessor<SetStatistic, typeof Clip.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SetStatisticRepository') protected setStatisticRepositoryGetter: Getter<SetStatisticRepository>,
  ) {
    super(Clip, dataSource);
    this.setStatistic = this.createBelongsToAccessorFor('setStatistic', setStatisticRepositoryGetter,);
    this.registerInclusionResolver('setStatistic', this.setStatistic.inclusionResolver);
  }
}
