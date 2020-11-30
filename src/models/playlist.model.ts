import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Program} from './program.model';

@model()
export class Playlist extends Entity {
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
    type: 'number',
  })
  week?: number;

  @belongsTo(() => Program)
  programId: number;

  constructor(data?: Partial<Playlist>) {
    super(data);
  }
}

export interface PlaylistRelations {
  // describe navigational properties here
}

export type PlaylistWithRelations = Playlist & PlaylistRelations;
