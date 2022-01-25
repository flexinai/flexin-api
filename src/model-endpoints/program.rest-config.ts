import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Program} from '../models';

const config: ModelCrudRestApiConfig = {
  model: Program,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/programs',
};
module.exports = config;
