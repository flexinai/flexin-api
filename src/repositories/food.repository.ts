import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Food, FoodRelations, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class FoodRepository extends DefaultCrudRepository<
  Food,
  typeof Food.prototype.id,
  FoodRelations
> {

  public readonly createdBy: BelongsToAccessor<User, typeof Food.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Food, dataSource);
    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter,);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
  }
}
