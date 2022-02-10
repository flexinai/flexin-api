import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {BindingScope, injectable} from '@loopback/core';
import {VIDEOTYPES} from '../utils/enums';



@injectable({scope: BindingScope.TRANSIENT})
export class VideoUploadService {

  getUploadUrl(fileName: string, path: VIDEOTYPES): Promise<string> {
    const client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
    const command = new PutObjectCommand({
      Bucket: 'flexin-video',
      Key: `${path}/${fileName}`,
      ContentType: 'application/octet-stream',
    });
    const url = getSignedUrl(client, command, { expiresIn: 300 });
    return url
  }

  deleteS3Video(url?: string) {
    if (!url) {
      return;
    }

    const filePath = url.split('https://flexin-video.s3.us-east-2.amazonaws.com/')[1]
    const client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
    const command = new DeleteObjectCommand({
      Bucket: 'flexin-video',
      Key: filePath,
    });
    return client.send(command);
  }
}
