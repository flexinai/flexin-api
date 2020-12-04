import {Entity, model, property} from '@loopback/repository';

@model()
export class Set extends Entity {
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
  order: number;

  @property({
    type: 'string',
    required: true,
  })
  notes: string;

  @property({
    type: 'number',
    required: true,
  })
  weight: number;

  @property({
    type: 'number',
    required: true,
  })
  reps: number;

  @property({
    type: 'number',
  })
  workoutId?: number;

  constructor(data?: Partial<Set>) {
    super(data);
  }
}

export interface SetRelations {
  // describe navigational properties here
}

export type SetWithRelations = Set & SetRelations;
