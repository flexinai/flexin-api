import {Entity, hasMany, model, property} from '@loopback/repository';
import {Program} from '.';
import {VISIBILITIES} from '../utils/enums';

@model()
export class Post extends Entity {
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
   * metadata
   */
  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(VISIBILITIES),
    },
  })
  visibility: string;

  @property({
    type: 'string',
    required: false,
  })
  description: string;

  /**
   * users
   */
  @property({
    type: 'string',
  })
  createdById: string;

  /**
   * relations
   */

  @hasMany(() => Program)
  program: Program[];

  constructor(data?: Partial<Post>) {
    super(data);
  }
}

export interface PostRelations {
  // describe navigational properties here
}

export type PostWithRelations = Post & PostRelations;
