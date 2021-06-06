import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Category} from './category.model';
import {ExerciseCategory} from './exercise-category.model';
import {Intensity} from './intensity.model';
import {User} from './user.model';

@model()
export class Exercise extends Entity {
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
  name: string;

  @property({
    type: 'boolean',
    required: true,
  })
  leftRight: boolean;

  @property({
    type: 'string',
    required: true,
  })
  measuredBy: string;

  @hasMany(() => Category, {through: {model: () => ExerciseCategory}})
  categories: Category[];

  @hasMany(() => Intensity)
  intensities: Intensity[];

  @belongsTo(() => User)
  createdById: number;

  constructor(data?: Partial<Exercise>) {
    super(data);
  }
}

export interface ExerciseRelations {
  // describe navigational properties here
}

export type ExerciseWithRelations = Exercise & ExerciseRelations;
