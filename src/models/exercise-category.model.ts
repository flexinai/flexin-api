import {Entity, model, property} from '@loopback/repository';

@model()
export class ExerciseCategory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  exerciseId?: number;

  @property({
    type: 'number',
  })
  categoryId?: number;

  constructor(data?: Partial<ExerciseCategory>) {
    super(data);
  }
}

export interface ExerciseCategoryRelations {
  // describe navigational properties here
}

export type ExerciseCategoryWithRelations = ExerciseCategory & ExerciseCategoryRelations;
