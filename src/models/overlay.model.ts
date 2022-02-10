import {Entity, model, property} from '@loopback/repository';
import {VIEWS} from '../utils/enums';

@model()
export class Overlay extends Entity {
  /**
   * required
   */
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
  url: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(VIEWS)
    }
  })
  view: string;

  /**
   * relations
   */
  @property({
    type: 'number',
    required: true
  })
  videoId: number;

  constructor(data?: Partial<Overlay>) {
    super(data);
  }
}

export interface OverlayRelations {
  // describe navigational properties here
}

export type OverlayWithRelations = Overlay & OverlayRelations;
