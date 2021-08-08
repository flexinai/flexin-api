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
    type: 'number',
    required: true,
  })
  start: number;

  @property({
    type: 'number',
    required: true,
  })
  end: number;


  constructor(data?: Partial<Clip>) {
    super(data);
  }
}

export interface ClipRelations {
  // describe navigational properties here
}

export type ClipWithRelations = Clip & ClipRelations;
