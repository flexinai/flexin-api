/* eslint-disable @typescript-eslint/naming-convention */
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody, Response, response, RestBindings, SchemaObject} from '@loopback/rest';
import {Overlay, Review} from '../models';
import {OverlayRepository, PostRepository, ReplyRepository, ReviewRepository} from '../repositories';
import {VideoUploadService} from '../services';
import {S3_URL} from '../utils/constsants';
import {UPLOADTYPES, VIEWS} from '../utils/enums';

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
      value?:
        | number
        | string
        | {
            url: string;
          }[];
    }[];
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
      type: string;
      id: string;
    };
    outputGroupDetails: {
      outputDetails: {
        outputFilePaths: string[];
        durationInMs: number;
        videoDetails: {
          widthInPx: number;
          heightInPx: number;
        };
      }[];
      type: string;
    }[];
  };
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
      value?:
        | number
        | string
        | {
            url: string;
          }[];
    }[];
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
  };
};

/* JSON schemas */
const TallySchema: SchemaObject = {
  type: 'object',
  properties: {
    eventId: {
      type: 'string',
    },
    eventType: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    data: {
      type: 'object',
      properties: {
        responseId: {
          type: 'string',
        },
        submissionId: {
          type: 'string',
        },
        respondentId: {
          type: 'string',
        },
        formId: {
          type: 'string',
        },
        formName: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
              },
              label: {
                type: 'string',
              },
              type: {
                type: 'string',
              },
              value: {
                oneOf: [
                  {
                    type: 'string',
                  },
                  {
                    type: 'number',
                  },
                  {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        url: {
                          type: 'string',
                          format: 'uri',
                        },
                        mimeType: {
                          type: 'string',
                        },
                        size: {
                          type: 'number',
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
};

const MediaConvertSchema: SchemaObject = {
  type: 'object',
  properties: {
    version: {
      type: 'string',
    },
    id: {
      type: 'string',
    },
    'detail-type': {
      type: 'string',
    },
    source: {
      type: 'string',
    },
    account: {
      type: 'string',
    },
    time: {
      type: 'string',
    },
    region: {
      type: 'string',
    },
    resources: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    detail: {
      type: 'object',
      properties: {
        timestamp: {
          type: 'number',
        },
        accountId: {
          type: 'string',
        },
        queue: {
          type: 'string',
        },
        jobId: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
        userMetadata: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
            id: {
              type: 'string',
            },
          },
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
                        type: 'string',
                      },
                    },
                    durationInMs: {
                      type: 'number',
                    },
                    videoDetails: {
                      type: 'object',
                      properties: {
                        widthInPx: {
                          type: 'number',
                        },
                        heightInPx: {
                          type: 'number',
                        },
                      },
                    },
                  },
                },
              },
              type: {
                type: 'string',
              },
            },
          },
        },
      },
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
          type: 'string',
        },
      },
    },
    metadata: {
      type: 'object',
      properties: {
        reviewedById: {
          type: 'string',
        },
      },
    },
  },
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
              type: 'string',
            },
          },
        },
      },
    },
  },
};

/* request bodies */
const TallyRequestBody = {
  description: 'Required fields to post a review from tally',
  required: true,
  content: {
    'application/json': {
      schema: TallySchema,
    },
  },
};

const MediaconvertRequestBody = {
  description: 'Required fields to post an Overlay from AWS MediaConvert',
  required: true,
  content: {
    'application/json': {
      schema: MediaConvertSchema,
    },
  },
};

const StripeRequestBody = {
  description: 'Required fields to patch a review from Stripe',
  required: true,
  content: {
    'application/json': {
      schema: StripeSchema,
    },
  },
};

const S3RequestBody = {
  description: 'Required fields to post an Overlay from S3',
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
    @repository(ReviewRepository)
    public reviewRepository: ReviewRepository,
    @repository(PostRepository)
    public postRepository: PostRepository,
    @repository(ReplyRepository)
    public replyRepository: ReplyRepository,
    @repository(OverlayRepository)
    public overlayRepository: OverlayRepository,
    @inject('services.VideoUploadService')
    protected videoUploadService: VideoUploadService,
  ) {}

  @post('/webhooks/tally/checkout')
  @response(204, {
    description: 'Review PUT success',
  })
  async createVideoNew(
    @requestBody(TallyRequestBody)
    tally: Tally,
  ): Promise<unknown> {
    /**
     * check if email has been used
     */
    const createdById = tally.data.fields.find(field => field.type === 'INPUT_EMAIL')?.value as string;

    const videoWithEmail = await this.reviewRepository.findOne({
      where: {
        createdById,
      },
    });
    const emailHasBeenUsed = videoWithEmail ? true : false;

    /**
     * check if payment
     */
    if (emailHasBeenUsed) {
      return;
    }

    /**
     * either return or proceed to upload
     */

    /**
     * check if multiple videos or single video
     */
    /**
     * upload the file to flexin-videos
     */
    const fileUpload = tally.data.fields.find(field => field.type === 'FILE_UPLOAD')?.value as {url: string}[];
    const {url} = fileUpload[0];

    /**
     * create the review
     */
    const reviewedById = tally.data.fields.find(field => field.type === 'INPUT_NUMBER')?.value as string;
    const review: Partial<Review> = {
      url,
      createdById,
      reviewedById,
    };
    /**
     * send coach the email
     */
    return this.reviewRepository.create(review);
  }

  @post('/webhooks/mediaconvert')
  @response(204, {
    description: 'Overlay POST success',
  })
  async patchFromMediaconvert(
    @requestBody(MediaconvertRequestBody)
    mediaConvert: MediaConvert,
  ): Promise<void> {
    /**
     * parse data
     */
    const type = mediaConvert.detail.userMetadata.type;
    const id = +mediaConvert.detail.userMetadata.id;
    const s3Url: string = mediaConvert.detail.outputGroupDetails[0].outputDetails[0].outputFilePaths[0];
    const location = s3Url.split('s3://flexin-video/')[1];

    /**
     * delete input
     */
    const inputUrl = `${S3_URL}/input/${location}`;
    await this.videoUploadService.deleteS3Video(inputUrl);

    /**
     * update the entity with the finished url
     */
    const url = `${S3_URL}/${location}`;
    switch (type) {
      case UPLOADTYPES.POST:
        await this.postRepository.updateById(id, {
          url,
        });
        return;
      case UPLOADTYPES.REVIEW:
        await this.reviewRepository.updateById(id, {
          url,
        });
        return;
      case UPLOADTYPES.REPLY:
        await this.replyRepository.updateById(id, {
          url,
        });
        return;
      default:
        return;
    }
  }

  @post('/webhooks/stripe')
  @response(204, {
    description: 'Review PATCH success',
  })
  async patchFromStripe(
    @requestBody(StripeRequestBody)
    stripeBody: Stripe,
  ): Promise<void> {
    return;
  }

  @post('/webhooks/s3')
  @response(204, {
    description: 'Overlay POST success',
  })
  async patchFromS3(
    @requestBody(S3RequestBody)
    s3Request: S3Request,
  ): Promise<void> {
    /**
     * key
     * example: 'views/json-angles/20220810T160842647Z-160917.json'
     */
    const key = s3Request.detail.object.key;
    const availableViews = Object.values(VIEWS);
    const KEYS = availableViews.map(view => `views/${view}`);
    const keyIndex = KEYS.findIndex(k => key.startsWith(k));
    /**
     * matchingKey
     * example: 'views/json-angles'
     */
    const matchingKey = KEYS[keyIndex];

    if (keyIndex === -1) {
      return;
    }

    /**
     * [fileName, extension]
     * example: '/20220810T160842647Z-160917', 'json'
     */
    const [fileName] = key.split(matchingKey)[1].split('.');
    const review = await this.reviewRepository.findOne({
      where: {
        url: `https://flexin-video.s3.us-east-2.amazonaws.com/review${fileName}.mp4`,
      },
    });
    const url = `https://flexin-video.s3.us-east-2.amazonaws.com/${key}`;

    const overlay: Partial<Overlay> = {
      url,
      reviewId: review?.id,
      view: availableViews[keyIndex],
    };

    await this.overlayRepository.create(overlay);
    return;
  }
}
