import {belongsTo, Entity, model, property} from '@loopback/repository';
import {CorrectionNote} from './correction-note.model';

@model()
export class Correction extends Entity {
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
  timestamp: number;

  @property({
    type: 'number',
  })
  videoId?: number;

  @property({
    type: 'string',
  })
  comment?: string;

  @belongsTo(() => CorrectionNote)
  correctionNoteId: number;

  @property({
    type: 'string',
  })
  createdById?: string;

  @property({
    type: 'number',
  })
  assignedToId?: number;

  @property({
    type: 'string',
    required: false,
  })
  videoCorrectionUrl?: string;

  constructor(data?: Partial<Correction>) {
    super(data);
  }
}

export interface CorrectionRelations {
  // describe navigational properties here
}

export type CorrectionWithRelations = Correction & CorrectionRelations;
