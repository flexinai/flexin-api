import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const AWS = require('aws-sdk');

const signedUrlExpireSeconds = 60 * 5;
const bucket = 'flexin-video';

// read S3 variables from .env
const config = {
  region: process.env.S3_REGION,
  signatureVersion: 'v4',
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
  endpoint: process.env.S3_ENDPOINT, // it could be any S3 provider
};

// pad with zero up to 2 digits
const padWithZero = (i: number): string => {
  return (i < 10 ? '0' : '') + i;
};

// timestamp for S3 filenames
const getCurrentTimeStamp = (): string => {
  let d = new Date();
  return (
    d.getFullYear() +
    padWithZero(d.getMonth() + 1) +
    padWithZero(d.getDate()) +
    '-' +
    padWithZero(d.getHours()) +
    padWithZero(d.getMinutes()) +
    padWithZero(d.getSeconds())
  );
};

@injectable({scope: BindingScope.TRANSIENT})
export class S3Service {
  s3;

  constructor(/* Add @inject to inject parameters */) {
    this.s3 = new AWS.S3(config);
  }

  getUploadUrl(fileName: string): object {
    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      ContentType: 'application/octet-stream',
      Expires: signedUrlExpireSeconds,
    };
    return {url: this.s3.getSignedUrl('pubObject', uploadParams)};
  }
}
