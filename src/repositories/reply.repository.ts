import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Reply, ReplyRelations} from '../models';

export class ReplyRepository extends DefaultCrudRepository<Reply, typeof Reply.prototype.id, ReplyRelations> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Reply, dataSource);
  }
}
