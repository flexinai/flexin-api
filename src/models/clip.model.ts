import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Annotation} from './annotation.model';
import {Video} from './video.model';

@model()
export class Clip extends Entity {
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
  startMilliseconds: number;

  @property({
    type: 'string',
    required: false,
  })
  url: string;

  @property({
    type: 'string',
    required: false,
  })
  analysisUrl?: string;

  @property({
    type: 'number',
    required: true,
  })
  endMilliseconds: number;

  @hasMany(() => Annotation)
  annotations: Annotation[];

  @belongsTo(() => Video)
  videoId: number;

  constructor(data?: Partial<Clip>) {
    super(data);
  }
}

export interface ClipRelations {
  // describe navigational properties here
  video: Video;
}

export type ClipWithRelations = Clip & ClipRelations;
