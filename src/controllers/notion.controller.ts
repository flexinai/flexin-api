import {inject} from '@loopback/core';
import {post, requestBody, SchemaObject, RequestBody} from '@loopback/rest';
import {NotionService} from '../services';

type NotionVideo = {
  url: string;
  email: string;
};

const myType: string = 'string';

const NotionVideoSchema: SchemaObject = {
  type: 'object',
  required: ['url', 'email'],
  properties: {
    url: {
      type: 'string',
      format: 'uri',
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

const NotionVideoRequestBody = {
  description: 'Required fields to post a video to Notion',
  required: true,
  content: {
    'application/json': {
      schema: NotionVideoSchema,
    },
  },
};

export class NotionController {
  constructor(
    @inject('services.NotionService')
    protected notionService: NotionService,
  ) {}

  @post('/notion', {
    responses: {
      '200': {
        description: 'Notion Page',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'id of new page',
                  format: 'uuid',
                  example: '6335312a-d4cc-4f6d-9430-0c44ca1368d6',
                },
                created_time: {
                  type: 'string',
                  description: 'creation timestamp',
                  format: 'date-time',
                },
                url: {
                  type: 'string',
                  description: 'URL of new page',
                  format: 'uri',
                  example: 'https://www.notion.so/6335312ad4cc4f6d94300c44ca1368d6',
                },
              },
            },
          },
        },
      },
    },
  })
  async createVideo(
    @requestBody(NotionVideoRequestBody)
    video: NotionVideo,
  ): Promise<any> {
    let newVideo = await this.notionService.createVideo(video.url, video.email);
    return {
      id: newVideo.id,
      created_time: newVideo.created_time,
      url: newVideo.url,
    };
  }
}
