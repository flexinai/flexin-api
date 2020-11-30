import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Category, CategoryRelations, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly createdBy: BelongsToAccessor<User, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Category, dataSource);
    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter,);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
  }
}
