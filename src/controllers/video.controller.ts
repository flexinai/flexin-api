import {inject} from '@loopback/core';
import {get} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {securityId, SecurityBindings, UserProfile} from '@loopback/security';
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

const bucket = 'flexin-video';

const padWithZero = (i:number):string => {
  return (i < 10 ? '0' : '') + i;
}

const getCurrentTimeStamp = ():string => {
  let d = new Date();

  return d.getFullYear() +
    padWithZero(d.getMonth() + 1) +
    padWithZero(d.getDate()) + '-' +
    padWithZero(d.getHours()) +
    padWithZero(d.getMinutes()) +
    padWithZero(d.getSeconds());
}

export class VideoController {
  constructor(@inject(SecurityBindings.USER, {optional: true}) private user: UserProfile) {}

  @authenticate('jwt')
  @get('/video/upload-url', {
    responses: {
      '200': {
        description: 'Object containing a pre-signed URL for upload to S3',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Pre-signed URL string',
                },
              },
            },
          },
        },
      },
    },
  })
  uploadUrl(): object {
    let fileName = this.user[securityId].padStart(8, '0') + '-' + getCurrentTimeStamp();

    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      ContentType: 'application/octet-stream',
      Expires: signedUrlExpireSeconds,
    };

    const s3 = new AWS.S3(config);

    return { url: s3.getSignedUrl('putObject', uploadParams) };
  }
}
