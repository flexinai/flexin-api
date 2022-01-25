import {Entity, model, property} from '@loopback/repository';

@model()
export class Program extends Entity {
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
  coachId: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  currentSubscriberCount: number;

  @property({
    type: 'number',
    required: true,
  })
  maxSubscriberCount: number;

  @property({
    type: 'string',
    required: true,
  })
  headline: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  // Define well-known properties here

  constructor(data?: Partial<Program>) {
    super(data);
  }
}

export interface ProgramRelations {
  // describe navigational properties here
}

export type ProgramWithRelations = Program & ProgramRelations;
