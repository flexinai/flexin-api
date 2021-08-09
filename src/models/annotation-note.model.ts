import {Entity, model, property} from '@loopback/repository';

@model()
export class AnnotationNote extends Entity {
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
  note: string;


  constructor(data?: Partial<AnnotationNote>) {
    super(data);
  }
}

export interface AnnotationNoteRelations {
  // describe navigational properties here
}

export type AnnotationNoteWithRelations = AnnotationNote & AnnotationNoteRelations;
