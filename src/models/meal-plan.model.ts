import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Meal} from './meal.model';
import {User} from './user.model';

@model()
export class MealPlan extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => Meal)
  meals: Meal[];

  @belongsTo(() => User)
  createdById: number;

  @belongsTo(() => User)
  assignedToId: number;

  constructor(data?: Partial<MealPlan>) {
    super(data);
  }
}

export interface MealPlanRelations {
  // describe navigational properties here
}

export type MealPlanWithRelations = MealPlan & MealPlanRelations;
