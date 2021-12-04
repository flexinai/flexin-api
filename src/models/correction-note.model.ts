import {Entity, model, property} from '@loopback/repository';

@model()
export class CorrectionNote extends Entity {
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
  note: string;

  @property({
    type: 'string',
    required: false,
  })
  url: string;

  constructor(data?: Partial<CorrectionNote>) {
    super(data);
  }
}

export interface CorrectionNoteRelations {
  // describe navigational properties here
}

export type CorrectionNoteWithRelations = CorrectionNote & CorrectionNoteRelations;
