import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Video} from '../models';

const config: ModelCrudRestApiConfig = {
  model: Video,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/videos',
};
module.exports = config;
