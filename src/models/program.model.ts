import {Entity, model, property, hasMany, hasOne, belongsTo} from '@loopback/repository';
import {Workout} from './workout.model';
import {SetStatistic} from './set-statistic.model';
import {User} from './user.model';

@model()
export class Program extends Entity {
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
  number: number;

  @hasMany(() => Workout)
  workouts: Workout[];

  @hasMany(() => SetStatistic)
  setStatistics: SetStatistic[];

  @belongsTo(() => User)
  createdById: number;

  @belongsTo(() => User)
  assignedToId: number;

  constructor(data?: Partial<Program>) {
    super(data);
  }
}

export interface ProgramRelations {
  // describe navigational properties here
}

export type ProgramWithRelations = Program & ProgramRelations;
