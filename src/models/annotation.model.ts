import {Entity, model, property} from '@loopback/repository';

@model()
export class Annotation extends Entity {
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
  timestamp: number;

  @property({
    type: 'number',
  })
  clipId?: number;

  constructor(data?: Partial<Annotation>) {
    super(data);
  }
}

export interface AnnotationRelations {
  // describe navigational properties here
}

export type AnnotationWithRelations = Annotation & AnnotationRelations;
