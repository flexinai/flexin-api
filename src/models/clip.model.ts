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
  startSeconds: number;

  @property({
    type: 'number',
    required: true,
  })
  endSeconds: number;

  @hasMany(() => Annotation)
  annotations: Annotation[];

  @belongsTo(() => Video)
  videoId: string;

  constructor(data?: Partial<Clip>) {
    super(data);
  }
}

export interface ClipRelations {
  // describe navigational properties here
}

export type ClipWithRelations = Clip & ClipRelations;
