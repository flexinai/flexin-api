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
    type: 'number',
    required: true,
  })
  number: number;


  constructor(data?: Partial<Program>) {
    super(data);
  }
}

export interface ProgramRelations {
  // describe navigational properties here
}

export type ProgramWithRelations = Program & ProgramRelations;
