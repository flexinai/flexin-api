import {DefaultCrudRepository} from '@loopback/repository';
import {Program, ProgramRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProgramRepository extends DefaultCrudRepository<
  Program,
  typeof Program.prototype.id,
  ProgramRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Program, dataSource);
  }
}
