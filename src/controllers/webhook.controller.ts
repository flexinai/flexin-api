import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody, Response, response, RestBindings, SchemaObject} from '@loopback/rest';
import {Video} from '../models';
import {VideoRepository} from '../repositories';


/* object specification for tally */
type Tally = {
  eventId: string;
  eventType: string;
  createdAt: string;
  data: {
    responseId: string;
    submissionId: string;
    respondentId: string;
    formId: string;
    formName: string;
    createdAt: string;
    fields: {
      key: string;
      label: string;
      type: string;
      value?: number | string | {
        url: string;
      }[];
    }[]
  };
};

/* JSON schema for tally */
const TallySchema: SchemaObject = {
  type: 'object',
  properties: {
    eventId: {
      type: 'string'
    },
    eventType: {
      type: 'string'
    },
    createdAt: {
      type: 'string'
    },
    data: {
      type: 'object',
      properties: {
        responseId: {
          type: 'string'
        },
        submissionId: {
          type: 'string'
        },
        respondentId: {
          type: 'string'
        },
        formId: {
          type: 'string'
        },
        formName: {
          type: 'string'
        },
        createdAt: {
          type: 'string'
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string'
              },
              label: {
                type: 'string'
              },
              type: {
                type: 'string'
              },
              value: {
                oneOf: [
                  {
                    type: "string"
                  },
                  {
                    type: "number"
                  },
                  {
                    type: "array",
                    items: {
                      type: 'object',
                      properties: {
                          id: {
                            type: "string"
                          },
                          name: {
                            type: "string"
                          },
                          url: {
                            type: "string",
                            format: 'uri',
                          },
                          mimeType: {
                            type: "string"
                          },
                          size: {
                            type: "number"
                          },
                        }
                      }
                    }
                ]
              }
            }
          }
        }
      }
    },
  },
};

/* request bodies */
const TallyRequestBody = {
  description: 'Required fields to post a video from tally',
  required: true,
  content: {
    'application/json': {
      schema: TallySchema,
    },
  },
};


export class WebhookController {
  constructor(
    @inject(RestBindings.Http.RESPONSE)
    protected responseService: Response,
    @repository(VideoRepository)
    public videoRepository: VideoRepository,
  ) {}

  @post('/webooks/tally')
  @response(204, {
    description: 'Video PUT success',
  })
  async createVideoNew(
    @requestBody(TallyRequestBody)
    tally: Tally,
  ): Promise<unknown> {
    const fileUpload = tally.data.fields.find(field => field.type === 'FILE_UPLOAD')?.value as { url: string }[]
    const {url} = fileUpload[0]
    const email = tally.data.fields.find(field => field.type === 'INPUT_EMAIL')?.value as string
    const reviewedById = tally.data.fields.find(field => field.type === 'INPUT_NUMBER')?.value as number
    const video: Partial<Video> = {
      url,
      email,
      reviewedById,
    }
    return this.videoRepository.create(video);
  }
}
