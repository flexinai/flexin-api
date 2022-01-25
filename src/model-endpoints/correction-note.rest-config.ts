import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {CorrectionNote} from '../models';

const config: ModelCrudRestApiConfig = {
  model: CorrectionNote,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/correction-notes',
};
module.exports = config;
