import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Program} from './program.model';
import {Food} from './food.model';

@model()
export class Meal extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  week: number;

  @property({
    type: 'number',
    required: true,
  })
  day: number;

  @property({
    type: 'number',
    required: true,
  })
  order: number;

  @belongsTo(() => Program)
  programId: number;

  @belongsTo(() => Food)
  foodId: number;

  @belongsTo(() => Food)
  chosenFoodId: number;

  @property({
    type: 'number',
  })
  mealPlanId?: number;

  constructor(data?: Partial<Meal>) {
    super(data);
  }
}

export interface MealRelations {
  // describe navigational properties here
}

export type MealWithRelations = Meal & MealRelations;
