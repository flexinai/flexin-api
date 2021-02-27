import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Workout} from './workout.model';
import {Program} from './program.model';
import {Clip} from './clip.model';

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
  @belongsTo(() => Workout)
  workoutId: number;

  @belongsTo(() => Program)
  programId: number;

  @hasOne(() => Clip)
  clip: Clip;

  constructor(data?: Partial<SetStatistic>) {
    super(data);
  }
}

export interface SetStatisticRelations {
  // describe navigational properties here
}

export type SetStatisticWithRelations = SetStatistic & SetStatisticRelations;
