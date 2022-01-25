import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Correction} from '../models';

const config: ModelCrudRestApiConfig = {
  model: Correction,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/corrections',
};
module.exports = config;
