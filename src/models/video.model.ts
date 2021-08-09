import {Entity, hasMany, model, property} from '@loopback/repository';
import {Clip} from './clip.model';

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

  @hasMany(() => Clip)
  clips: Clip[];

  constructor(data?: Partial<Video>) {
    super(data);
  }
}

export interface VideoRelations {
  // describe navigational properties here
}

export type VideoWithRelations = Video & VideoRelations;
