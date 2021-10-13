import {Entity, hasMany, model, property, belongsTo} from '@loopback/repository';
import {Clip} from './clip.model';
import {User} from './user.model';

@model()
export class Video extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'string',
  })
  email?: string;

  // 'pending', 'valid', and 'invalid'. default to 'pending'
  @property({
    type: 'string',
    default: 'pending',
  })
  status?: string;

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
