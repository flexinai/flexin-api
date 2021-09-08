import {inject} from '@loopback/core';
import {post, requestBody, Response, RestBindings, SchemaObject} from '@loopback/rest';
import {MixpanelEvent, MixpanelService, NotionService} from '../services';

/* object specification for new video */
type NotionVideo = {
  url: string;
  email: string;
};

/* JSON schema for new video */
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

/* request body */
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
    @inject('services.MixpanelService')
    protected mixpanelService: MixpanelService,
    @inject(RestBindings.Http.RESPONSE)
    protected response: Response,
  ) {}

  @post('/notion', {
    responses: {
      '201': {
        description: 'Notion page created',
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
    let newVideo = await this.notionService.createPage(video.url, video.email);
    this.response.status(201);

    // log a mixpanel event
    this.mixpanelService.trackEvent({
      name: 'video submitted',
      distinctId: video.email,
      additionalProperties: {videoId: video.url},
    });

    /* object returned from the API has the full details with all created properties;
       return just the id, created_time, & url */
    return {
      id: newVideo.id,
      created_time: newVideo.created_time,
      url: newVideo.url,
    };
  }
}
