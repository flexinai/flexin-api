import {Entity, model, property} from '@loopback/repository';

@model()
export class Intensity extends Entity {
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
  order: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;


  constructor(data?: Partial<Intensity>) {
    super(data);
  }
}

export interface IntensityRelations {
  // describe navigational properties here
}

export type IntensityWithRelations = Intensity & IntensityRelations;
