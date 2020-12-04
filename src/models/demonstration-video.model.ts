import {Entity, model, property} from '@loopback/repository';

@model()
export class DemonstrationVideo extends Entity {
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
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

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
