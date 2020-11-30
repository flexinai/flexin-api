import {Entity, model, property} from '@loopback/repository';

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


  constructor(data?: Partial<MealPlan>) {
    super(data);
  }
}

export interface MealPlanRelations {
  // describe navigational properties here
}

export type MealPlanWithRelations = MealPlan & MealPlanRelations;
