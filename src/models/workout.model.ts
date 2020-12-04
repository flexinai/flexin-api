import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Program} from './program.model';
import {Exercise} from './exercise.model';
import {Set} from './set.model';
import {Intensity} from './intensity.model';
import {SetStatistic} from './set-statistic.model';

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

  @belongsTo(() => Program)
  programId: number;

  @belongsTo(() => Exercise)
  exerciseId: number;

  @hasMany(() => Set)
  sets: Set[];

  @belongsTo(() => Intensity)
  intensityId: number;

  @hasMany(() => SetStatistic)
  setStatistics: SetStatistic[];

  constructor(data?: Partial<Workout>) {
    super(data);
  }
}

export interface WorkoutRelations {
  // describe navigational properties here
}

export type WorkoutWithRelations = Workout & WorkoutRelations;
