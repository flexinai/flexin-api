import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Clip} from '../models';

const config: ModelCrudRestApiConfig = {
  model: Clip,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/clips',
};
module.exports = config;
