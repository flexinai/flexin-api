import {Entity, model, property} from '@loopback/repository';

@model()
export class Clip extends Entity {
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
  videoId: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  start: number;

  @property({
    type: 'number',
    required: true,
  })
  end: number;

  @property({
    type: 'boolean',
    required: true,
  })
  special: boolean;

  @property({
    type: 'number',
  })
  setStatisticId?: number;

  constructor(data?: Partial<Clip>) {
    super(data);
  }
}

export interface ClipRelations {
  // describe navigational properties here
}

export type ClipWithRelations = Clip & ClipRelations;
