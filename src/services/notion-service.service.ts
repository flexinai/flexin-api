import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {NotionDataSource} from '../datasources';

export interface NotionService {
  // Node.js methods that will be mapped to REST/SOAP/gRPC operations as
  // stated in the datasource json file.
  createVideo(url: string, email: string): Promise<any>;
}

export class NotionServiceProvider implements Provider<NotionService> {
  constructor(
    // notion must match the name property in the datasource json file
    @inject('datasources.notion')
    protected dataSource: NotionDataSource = new NotionDataSource(),
  ) {}

  value(): Promise<NotionService> {
    return getService(this.dataSource);
  }
}
