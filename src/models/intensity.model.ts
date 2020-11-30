import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Exercise} from './exercise.model';
import {User} from './user.model';

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

  @belongsTo(() => Exercise)
  exerciseId: number;

  @belongsTo(() => User)
  createdById: number;

  constructor(data?: Partial<Intensity>) {
    super(data);
  }
}

export interface IntensityRelations {
  // describe navigational properties here
}

export type IntensityWithRelations = Intensity & IntensityRelations;
