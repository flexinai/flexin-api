import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Video} from '.';
import {CorrectionNote} from './correction-note.model';

@model()
export class Correction extends Entity {
  /**
   * required
   */
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

  /**
   * metadata
   */
  @property({
    type: 'string',
  })
  comment?: string;

  /**
   * users
   */
  @property({
    type: 'string',
  })
  createdById?: string;

  @property({
    type: 'number',
  })
  assignedToId?: number;

  /**
   * relations
   */
  @property({
    type: 'number',
  })
  reviewId?: number;

  @belongsTo(() => Video)
  replyId: number;

  @belongsTo(() => CorrectionNote)
  correctionNoteId: number;

  constructor(data?: Partial<Correction>) {
    super(data);
  }
}

export interface CorrectionRelations {
  // describe navigational properties here
}

export type CorrectionWithRelations = Correction & CorrectionRelations;
