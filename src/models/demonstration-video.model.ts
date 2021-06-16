import {model, property} from '@loopback/repository';
import {Video} from './video.model';

@model()
export class DemonstrationVideo extends Video {
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  notes?: string;

  @property({
    type: 'number',
  })
  createdById?: number;

  @property({
    type: 'number',
  })
  exerciseId?: number;

  constructor(data?: Partial<DemonstrationVideo>) {
    super(data);
  }
}

export interface DemonstrationVideoRelations {
  // describe navigational properties here
}

export type DemonstrationVideoWithRelations = DemonstrationVideo & DemonstrationVideoRelations;
