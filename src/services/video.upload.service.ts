import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import { /* inject, */ BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class VideoUploadService {

  async getUploadUrl(fileName: string): Promise<string> {
    const client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
    const command = new PutObjectCommand({
      Bucket: 'flexin-video',
      Key: fileName,
      ContentType: 'application/octet-stream',
    });
    const url = await getSignedUrl(client, command, { expiresIn: 300 });
    return url
  }
}
