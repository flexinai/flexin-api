/* eslint-disable @typescript-eslint/naming-convention */
export type Tally = {
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

export type MediaConvert = {
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

export type Stripe = {
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

export type S3Request = {
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
