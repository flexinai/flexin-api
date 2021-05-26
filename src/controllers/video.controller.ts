import {get} from '@loopback/rest';
const AWS = require('aws-sdk');

const signedUrlExpireSeconds = 60 * 5;

// read variables from .env
const config = {
  region: process.env.S3_REGION,
  signatureVersion: 'v4',
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
  endpoint: process.env.S3_ENDPOINT, // it could be any S3 provider
};

export class VideoController {
  constructor() {}

  @get('/video/upload-url')
  uploadUrl(): Promise<string> {
    const s3UploadParams = {
      Bucket: 'flexin-video',
      Key: 'lb-test.jpg',
      ContentType: 'application/octet-stream',
      Expires: signedUrlExpireSeconds,
    };
    const s3 = new AWS.S3(config);
    return s3.getSignedUrl('putObject', s3UploadParams);
  }
}
