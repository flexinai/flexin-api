import {Entity, model, property, belongsTo} from '@loopback/repository';
import {AnnotationNote} from './annotation-note.model';

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

  @belongsTo(() => AnnotationNote)
  annotationNoteId: number;

  @property({
    type: 'number',
  })
  createdById?: number;

  @property({
    type: 'number',
  })
  assignedToId?: number;

  constructor(data?: Partial<Annotation>) {
    super(data);
  }
}

export interface AnnotationRelations {
  // describe navigational properties here
}

export type AnnotationWithRelations = Annotation & AnnotationRelations;
