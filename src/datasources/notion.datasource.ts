import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const databaseIdNew = process.env.NOTION_DATABASE_ID_NEW;
const databaseIdReviewed = process.env.NOTION_DATABASE_ID_REVIEWED;
const notionVersion = process.env.NOTION_API_VERSION;

const config = {
  name: 'notion',
  connector: 'rest',
  baseURL: 'https://api.notion.com',
  crud: false,
  options: {
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + process.env.NOTION_API_KEY,
      'Notion-Version': notionVersion,
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: 'https://api.notion.com/v1/pages',
        body: {
          parent: {database_id: databaseIdNew},
          properties: {
            'YouTube URL': {
              type: 'url',
              url: '{url}',
            },
            Email: {
              type: 'email',
              email: '{email}',
            },
          },
        },
      },
      functions: {
        addVideoNew: ['url', 'email'],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'https://api.notion.com/v1/pages',
        body: {
          parent: {database_id: databaseIdReviewed},
          properties: {
            videoId: {
              type: 'rich_text',
              rich_text: [{type: 'text', text: {content: '{videoId}'}}],
            },
            email: {
              type: 'email',
              email: '{email}',
            },
          },
        },
      },
      functions: {
        addVideoReviewed: ['videoId', 'email'],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NotionDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'notion';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.notion', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
