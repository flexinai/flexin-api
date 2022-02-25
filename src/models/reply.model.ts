import {Entity, model, property} from '@loopback/repository';

@model()
export class Reply extends Entity {
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
    type: 'date',
    default: '$now',
  })
  postedAt?: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'number',
    required: true,
  })
  durationMs: number;

  @property({
    type: 'string',
    required: false,
  })
  thumbnailUrl: string;

  /**
   * users
   */
  @property({
    type: 'string',
  })
  createdById: string;

  constructor(data?: Partial<Reply>) {
    super(data);
  }
}

export interface ReplyRelations {
  // describe navigational properties here
}

export type ReplyWithRelations = Reply & ReplyRelations;
