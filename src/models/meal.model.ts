import {Entity, model, property} from '@loopback/repository';

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


  constructor(data?: Partial<Meal>) {
    super(data);
  }
}

export interface MealRelations {
  // describe navigational properties here
}

export type MealWithRelations = Meal & MealRelations;
