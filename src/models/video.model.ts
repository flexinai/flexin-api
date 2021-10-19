import {Entity, hasMany, model, property, belongsTo} from '@loopback/repository';
import {Clip} from './clip.model';
import {User} from './user.model';

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
    required: true,
  })
  email: string;

  // 'pending', 'valid', and 'invalid'. default to 'pending'
  @property({
    type: 'string',
    default: 'pending',
  })
  status?: string;

  @property({
    type: 'date',
    required: false,
    defaultFn: 'now',
  })
  processingEmailSent: string;

  @property({
    type: 'date',
    required: false,
  })
  reviewedEmailSent: string;

  @hasMany(() => Clip)
  clips: Clip[];

  @belongsTo(() => User)
  reviewedById: number;

  constructor(data?: Partial<Video>) {
    super(data);
  }
}

export interface VideoRelations {
  // describe navigational properties here
}

export type VideoWithRelations = Video & VideoRelations;
