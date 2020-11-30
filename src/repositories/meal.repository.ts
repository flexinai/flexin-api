import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Meal, MealRelations, Program, Food} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProgramRepository} from './program.repository';
import {FoodRepository} from './food.repository';

export class MealRepository extends DefaultCrudRepository<
  Meal,
  typeof Meal.prototype.id,
  MealRelations
> {

  public readonly program: BelongsToAccessor<Program, typeof Meal.prototype.id>;

  public readonly food: BelongsToAccessor<Food, typeof Meal.prototype.id>;

  public readonly chosenFood: BelongsToAccessor<Food, typeof Meal.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProgramRepository') protected programRepositoryGetter: Getter<ProgramRepository>, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>,
  ) {
    super(Meal, dataSource);
    this.chosenFood = this.createBelongsToAccessorFor('chosenFood', foodRepositoryGetter,);
    this.registerInclusionResolver('chosenFood', this.chosenFood.inclusionResolver);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
    this.program = this.createBelongsToAccessorFor('program', programRepositoryGetter,);
    this.registerInclusionResolver('program', this.program.inclusionResolver);
  }
}
