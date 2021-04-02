// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
import {UserIdentity} from './user-identity.model';
import {Category} from './category.model';
import {Exercise} from './exercise.model';
import {Intensity} from './intensity.model';
import {Program} from './program.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  realm?: string;

  // must keep it
  @property({
    type: 'string',
    required: true,
    index: {unique: true},
  })
  username: string;

  // must keep it
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
  })
  verificationToken?: string;

  @hasMany(() => Category, {keyTo: 'createdById'})
  categoriesCreated: Category[];

  @hasMany(() => Exercise, {keyTo: 'createdById'})
  exercisesCreated: Exercise[];

  @hasMany(() => Intensity, {keyTo: 'createdById'})
  intensitiesCreated: Intensity[];

  @hasOne(() => UserCredentials)
  credentials?: UserCredentials;

  @hasMany(() => UserIdentity)
  profiles?: UserIdentity[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
