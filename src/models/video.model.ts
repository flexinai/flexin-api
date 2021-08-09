import {Entity, model, property, hasMany} from '@loopback/repository';
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
