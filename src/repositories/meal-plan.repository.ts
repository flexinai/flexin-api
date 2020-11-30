import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MealPlan, MealPlanRelations, Meal, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {MealRepository} from './meal.repository';
import {UserRepository} from './user.repository';

export class MealPlanRepository extends DefaultCrudRepository<
  MealPlan,
  typeof MealPlan.prototype.id,
  MealPlanRelations
> {

  public readonly meals: HasManyRepositoryFactory<Meal, typeof MealPlan.prototype.id>;

  public readonly createdBy: BelongsToAccessor<User, typeof MealPlan.prototype.id>;

  public readonly assignedTo: BelongsToAccessor<User, typeof MealPlan.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('MealRepository') protected mealRepositoryGetter: Getter<MealRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(MealPlan, dataSource);
    this.assignedTo = this.createBelongsToAccessorFor('assignedTo', userRepositoryGetter,);
    this.registerInclusionResolver('assignedTo', this.assignedTo.inclusionResolver);
    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter,);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
    this.meals = this.createHasManyRepositoryFactoryFor('meals', mealRepositoryGetter,);
    this.registerInclusionResolver('meals', this.meals.inclusionResolver);
  }
}
