import {Entity, hasMany, model, property} from '@loopback/repository';
import {Clip} from './clip.model';

@model()
export class Video extends Entity {
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
  url: string;

  @property({
    type: 'string',
    required: false,
  })
  analysisUrl?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  // 'pending', 'valid', and 'invalid'. default to 'pending'
  @property({
    type: 'string',
    default: 'valid',
  })
  status?: string;

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

  @hasMany(() => Clip)
  clips: Clip[];

  @property({
    type: 'string',
    required: false,
  })
  reviewedById: string;

  @property({
    type: 'number',
    required: true,
  })
  endMilliseconds: number;

  constructor(data?: Partial<Video>) {
    super(data);
  }
}

export interface VideoRelations {
  // describe navigational properties here
}

export type VideoWithRelations = Video & VideoRelations;
