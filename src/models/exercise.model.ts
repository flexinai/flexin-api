import {Entity, model, property} from '@loopback/repository';

@model()
export class Exercise extends Entity {
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

  @property({
    type: 'boolean',
    required: true,
  })
  leftRight: boolean;

  @property({
    type: 'string',
    required: true,
  })
  measuredBy: string;


  constructor(data?: Partial<Exercise>) {
    super(data);
  }
}

export interface ExerciseRelations {
  // describe navigational properties here
}

export type ExerciseWithRelations = Exercise & ExerciseRelations;
