import {Entity, model, property} from '@loopback/repository';

@model()
export class Workout extends Entity {
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

  @property({
    type: 'number',
    required: true,
  })
  reps: number;

  @property({
    type: 'boolean',
    required: true,
  })
  amrap: boolean;

  @property({
    type: 'number',
    required: true,
  })
  setCount: number;

  @property({
    type: 'number',
    required: true,
  })
  weight: number;

  @property({
    type: 'string',
    required: true,
  })
  weightUnit: string;

  @property({
    type: 'string',
    required: true,
  })
  tempo: string;

  @property({
    type: 'string',
    required: true,
  })
  notes: string;

  @property({
    type: 'string',
  })
  playlistUrl?: string;

  @property({
    type: 'number',
  })
  rpe?: number;

  @property({
    type: 'string',
  })
  athleteNotes?: string;

  @property({
    type: 'number',
  })
  programId?: number;

  constructor(data?: Partial<Workout>) {
    super(data);
  }
}

export interface WorkoutRelations {
  // describe navigational properties here
}

export type WorkoutWithRelations = Workout & WorkoutRelations;
