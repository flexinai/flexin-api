import {Entity, hasMany, model, property} from '@loopback/repository';
import {Correction, Overlay} from '.';
import {STATUSES, VISIBILITIES} from '../utils/enums';

@model()
export class Review extends Entity {
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
    type: 'date',
    default: '$now',
  })
  postedAt?: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'number',
    required: true,
  })
  durationMs: number;

  @property({
    type: 'string',
    required: false,
  })
  thumbnailUrl: string;

  /**
   * metadata
   */
  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(VISIBILITIES),
    },
  })
  visibility: string;

  @property({
    type: 'string',
    default: STATUSES.VALID,
    jsonSchema: {
      enum: Object.values(STATUSES),
    },
  })
  status?: string;

  /**
   * emails
   */
  @property({
    type: 'date',
    required: false,
  })
  processingEmailSent: Date;

  @property({
    type: 'date',
    required: false,
  })
  reviewedEmailSent: Date;

  @property({
    type: 'date',
    required: false,
  })
  readyForCoachEmailSent: Date;

  /**
   * users
   */
  @property({
    type: 'string',
    required: false,
  })
  reviewedById: string;

  @property({
    type: 'string',
  })
  createdById: string;

  /**
   * relations
   */
  @hasMany(() => Overlay)
  overlays: Overlay[];

  @hasMany(() => Correction)
  corrections: Correction[];

  constructor(data?: Partial<Review>) {
    super(data);
  }
}

export interface ReviewRelations {
  // describe navigational properties here
}

export type ReviewWithRelations = Review & ReviewRelations;
