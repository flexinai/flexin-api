/* eslint-disable @typescript-eslint/naming-convention */
import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody, Response, response, RestBindings, SchemaObject} from '@loopback/rest';
import {Clip, Video} from '../models';
import {ClipRepository, VideoRepository} from '../repositories';


/* object specifications */
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

type MediaConvert = {
  version: string;
  id: string;
  'detail-type': string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: {
    timestamp: number;
    accountId: string;
    queue: string;
    jobId: string;
    status: string;
    userMetadata: {
      clip: string;
    };
    outputGroupDetails: {
      outputDetails: {
        outputFilePaths: string[];
        durationInMs: number;
        videoDetails: {
          widthInPx: number;
          heightInPx: number;
        }
      }[];
      type: string;
    }[]
  }
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

type Stripe = {
  data: {
    object: {
       billing_details: {
         email: string;
       };
       metadata: {
         reviewedById: string;
       };
       customer_details: {
         email: string;
       };
    };
  };
};

type S3Request = {
  version: string;
  id: string;
  'detail-type': string;
  source: string;
  account: string;
  time: string;
  region: string;
  detail: {
    version: number;
    bucket: {
      name: string;
    };
    object: {
      key: string;
      size: number;
      etag: string;
      sequencer: string;
    };
    'request-id': string;
    requester: string;
    'source-ip-address': string;
    reason: string;
  }
};


/* JSON schemas */
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


const MediaConvertSchema: SchemaObject = {
  type: 'object',
  properties: {
    version: {
      type: 'string'
    },
    id: {
      type: 'string'
    },
    "detail-type": {
      type: 'string'
    },
    source: {
      type: 'string'
    },
    account: {
      type: 'string'
    },
    time: {
      type: 'string'
    },
    region: {
      type: 'string'
    },
    resources: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    detail: {
      type: 'object',
      properties: {
        timestamp: {
          type: 'number'
        },
        accountId: {
          type: 'string'
        },
        queue: {
          type: 'string'
        },
        jobId: {
          type: 'string'
        },
        status: {
          type: 'string'
        },
        userMetadata: {
          type: 'object',
          properties: {
            clip: {
              type: 'string'
            }
          }
        },
        outputGroupDetails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                outputDetails: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      outputFilePaths: {
                        type: 'array',
                        items: {
                          type: 'string'
                        }
                      },
                      durationInMs: {
                        type: 'number'
                      },
                      videoDetails: {
                        type: 'object',
                        properties: {
                          widthInPx: {
                            type: 'number'
                          },
                          heightInPx: {
                            type: 'number'
                          }
                        }
                      },
                    }
                  }
                },
                type: {
                  type: 'string'
                }
              }
            }
          }
      }
    },
  },
};


const StripeSchema: SchemaObject = {
  type: 'object',
  properties: {
    billing_details: {
      type: 'object',
      properties: {
        email: {
          type: 'string'
        }
      }
    },
    metadata: {
      type: 'object',
      properties: {
        reviewedById: {
          type: 'string'
        }
      }
    }
  }
};

const S3Schema: SchemaObject = {
  type: 'object',
  properties: {
    detail: {
      type: 'object',
      properties: {
        object: {
          type: 'object',
          properties: {
            key: {
              type: 'string'
            }
          }
        }
      }
    }
  }
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

const MediaconvertRequestBody = {
  description: 'Required fields to patch a clip from AWS MediaConvert',
  required: true,
  content: {
    'application/json': {
      schema: MediaConvertSchema,
    },
  },
};

const StripeRequestBody = {
  description: 'Required fields to patch a video from Stripe',
  required: true,
  content: {
    'application/json': {
      schema: StripeSchema,
    },
  },
};

const S3RequestBody = {
  description: 'Required fields to patch a clip from S3',
  required: true,
  content: {
    'application/json': {
      schema: S3Schema,
    },
  },
};


export class WebhookController {
  constructor(
    @inject(RestBindings.Http.RESPONSE)
    protected responseService: Response,
    @repository(VideoRepository)
    public videoRepository: VideoRepository,
    @repository(ClipRepository)
    public clipRepository: ClipRepository,
  ) {}

  @post('/webhooks/tally')
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
    const reviewedById = tally.data.fields.find(field => field.type === 'INPUT_NUMBER')?.value as string
    const video: Partial<Video> = {
      url,
      email,
      reviewedById,
    }
    return this.videoRepository.create(video);
  }

  @post('/webhooks/mediaconvert')
  @response(204, {
    description: 'Clip PATCH success',
  })
  async patchFromMediaconvert(
    @requestBody(MediaconvertRequestBody)
    mediaConvert: MediaConvert,
  ): Promise<void> {
    const id = +mediaConvert.detail.userMetadata.clip
    const s3Url: string = mediaConvert.detail.outputGroupDetails[0].outputDetails[0].outputFilePaths[0]
    const video = s3Url.split('s3://flexin-video/')[1]
    const url = `https://flexin-video.s3.us-east-2.amazonaws.com/${video}`
    const clip = {
      url
    };
    await this.clipRepository.updateById(id, clip);
  }

  @post('/webhooks/stripe')
  @response(204, {
    description: 'Video PATCH success',
  })
  async patchFromStripe(
    @requestBody(StripeRequestBody)
    stripeBody: Stripe,
  ): Promise<void> {

    return;
  }

  @post('/webhooks/s3')
  @response(204, {
    description: 'Clip PATCH success',
  })
  async patchFromS3(
    @requestBody(S3RequestBody)
    s3Request: S3Request,
  ): Promise<void> {
    const key = s3Request.detail.object.key
    const KEYS = [
      'clips-ai/',
      'clips-ai-with-angles/'
    ]
    const matchingKey = KEYS.find(k => key.startsWith(k))
    if (!matchingKey) {
      return;
    }

    const file = key.split(matchingKey)[1]
    const id = +file.split('-')[0]
    const url = `https://flexin-video.s3.us-east-2.amazonaws.com/${key}`;

    const clip: Partial<Clip> = {};

    if (matchingKey === KEYS[0]) {
      clip.analysisUrl = url
    }

    if (matchingKey === KEYS[1]) {
      clip.aiWithAnglesUrl = url
    }

    await this.clipRepository.updateById(id, clip);
    return;
  }
}
