import {DefaultCrudRepository} from '@loopback/repository';
import {UserProgram, UserProgramRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserProgramRepository extends DefaultCrudRepository<
  UserProgram,
  typeof UserProgram.prototype.id,
  UserProgramRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserProgram, dataSource);
  }
}
