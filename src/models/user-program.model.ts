import {Entity, model, property} from '@loopback/repository';

@model()
export class UserProgram extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  userId?: number;

  @property({
    type: 'number',
  })
  programId?: number;

  constructor(data?: Partial<UserProgram>) {
    super(data);
  }
}

export interface UserProgramRelations {
  // describe navigational properties here
}

export type UserProgramWithRelations = UserProgram & UserProgramRelations;
