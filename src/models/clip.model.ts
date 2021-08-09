import {Entity, model, property, hasMany} from '@loopback/repository';
import {Annotation} from './annotation.model';

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
  start: number;

  @property({
    type: 'number',
    required: true,
  })
  end: number;

  @hasMany(() => Annotation)
  annotations: Annotation[];

  @property({
    type: 'number',
  })
  videoId?: number;

  constructor(data?: Partial<Clip>) {
    super(data);
  }
}

export interface ClipRelations {
  // describe navigational properties here
}

export type ClipWithRelations = Clip & ClipRelations;
