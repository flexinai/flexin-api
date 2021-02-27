import {Entity, model, property, belongsTo} from '@loopback/repository';
import {SetStatistic} from './set-statistic.model';

@model()
export class Clip extends Entity {
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
  videoId: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

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

  @property({
    type: 'boolean',
    required: true,
  })
  special: boolean;

  @belongsTo(() => SetStatistic)
  setStatisticId: number;

  constructor(data?: Partial<Clip>) {
    super(data);
  }
}

export interface ClipRelations {
  // describe navigational properties here
}

export type ClipWithRelations = Clip & ClipRelations;
