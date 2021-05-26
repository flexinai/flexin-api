import {Model, model, property} from '@loopback/repository';

@model()
export class Video extends Model {
  @property({
    type: 'string',
    required: true,
  })
  url: string;

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
  source: string;

  @property({
    type: 'string',
  })
  thumbnailUrl?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isArchived?: boolean;


  constructor(data?: Partial<Video>) {
    super(data);
  }
}

export interface VideoRelations {
  // describe navigational properties here
}

export type VideoWithRelations = Video & VideoRelations;
