import {model, property} from '@loopback/repository';
import {Video} from '.';

@model()
export class WorkoutVideo extends Video {

  constructor(data?: Partial<WorkoutVideo>) {
    super(data);
  }
}

export interface WorkoutVideoRelations {
  // describe navigational properties here
}

export type WorkoutVideoWithRelations = WorkoutVideo & WorkoutVideoRelations;
