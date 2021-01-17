import {Entity, model, property, hasMany, hasOne, belongsTo} from '@loopback/repository';
import {Workout} from './workout.model';
import {SetStatistic} from './set-statistic.model';
import {Playlist} from './playlist.model';
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

  @hasOne(() => Playlist)
  playlist: Playlist;

  @belongsTo(() => User)
  createdById: number;

  constructor(data?: Partial<Program>) {
    super(data);
  }
}

export interface ProgramRelations {
  // describe navigational properties here
}

export type ProgramWithRelations = Program & ProgramRelations;
