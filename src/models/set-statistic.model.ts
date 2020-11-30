import {Entity, model, property} from '@loopback/repository';

@model()
export class SetStatistic extends Entity {
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
  set: number;

  @property({
    type: 'number',
    required: true,
  })
  reps: number;

  @property({
    type: 'number',
  })
  weight?: number;


  constructor(data?: Partial<SetStatistic>) {
    super(data);
  }
}

export interface SetStatisticRelations {
  // describe navigational properties here
}

export type SetStatisticWithRelations = SetStatistic & SetStatisticRelations;
