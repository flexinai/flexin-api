import {model, property, hasMany} from '@loopback/repository';
import {Video} from './video.model';
import {Clip} from './clip.model';

@model()
export class WorkoutVideo extends Video {

  @property({
    type: 'number',
  })
  createdById?: number;

  @hasMany(() => Clip)
  clips: Clip[];

  constructor(data?: Partial<WorkoutVideo>) {
    super(data);
  }
}

export interface WorkoutVideoRelations {
  // describe navigational properties here
}

export type WorkoutVideoWithRelations = WorkoutVideo & WorkoutVideoRelations;
