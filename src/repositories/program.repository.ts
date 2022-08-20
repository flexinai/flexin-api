import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Program, ProgramRelations} from '../models';

export class ProgramRepository extends DefaultCrudRepository<Program, typeof Program.prototype.id, ProgramRelations> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Program, dataSource);
  }
}
