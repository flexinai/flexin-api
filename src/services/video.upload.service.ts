import {CreateJobCommand, MediaConvertClient} from '@aws-sdk/client-mediaconvert';
import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {BindingScope, injectable} from '@loopback/core';
import {Post, Reply, Review} from '../models';
import {S3_URL} from '../utils/constsants';
import {UPLOADTYPES} from '../utils/enums';

@injectable({scope: BindingScope.TRANSIENT})
export class VideoUploadService {

  getUploadUrl(fileName: string, type: UPLOADTYPES): Promise<string> {
    const isVideo = type === UPLOADTYPES.POST || type === UPLOADTYPES.REPLY || type === UPLOADTYPES.REVIEW;
    const key = isVideo ? `input/${type}/${fileName}` : `${type}/${fileName}`
    const client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
    const command = new PutObjectCommand({
      Bucket: 'flexin-video',
      Key: key,
      ContentType: 'application/octet-stream',
    });
    const url = getSignedUrl(client, command, { expiresIn: 300 });
    return url
  }

  deleteS3Video(url?: string) {
    if (!url) {
      return;
    }

    const filePath = url.split(`${S3_URL}/`)[1]
    const client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
    const command = new DeleteObjectCommand({
      Bucket: 'flexin-video',
      Key: filePath,
    });
    return client.send(command);
  }

  async sendJob(video: Review | Post | Reply, type: UPLOADTYPES) {
    const fileInput = video.url
    const id = `${video.id}`
    const client = new MediaConvertClient({
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: 'https://mqm13wgra.mediaconvert.us-east-2.amazonaws.com'
    });
    const command = new CreateJobCommand({
      Queue: "arn:aws:mediaconvert:us-east-2:816488412071:queues/Default",
      UserMetadata: {
        type,
        id
      },
      Role: "arn:aws:iam::816488412071:role/service-role/MediaConvert_Default_Role_1",
      Settings: {
        TimecodeConfig: {
          "Source": "ZEROBASED"
        },
        OutputGroups: [
          {
            CustomName: "flex",
            Name: "File Group",
            Outputs: [
              {
                ContainerSettings: {
                  Container: "MP4",
                  Mp4Settings: {}
                },
                VideoDescription: {
                  CodecSettings: {
                    Codec: "H_264",
                    H264Settings: {
                      MaxBitrate: 5000000,
                      RateControlMode: "QVBR",
                      SceneChangeDetect: "TRANSITION_DETECTION"
                    }
                  }
                },
                AudioDescriptions: [
                  {
                    CodecSettings: {
                      Codec: "AAC",
                      AacSettings: {
                        Bitrate: 96000,
                        CodingMode: "CODING_MODE_2_0",
                        SampleRate: 48000
                      }
                    }
                  }
                ],
                NameModifier: "-$t$"
              }
            ],
            OutputGroupSettings: {
              Type: "FILE_GROUP_SETTINGS",
              FileGroupSettings: {
                Destination: `s3://flexin-video/${type}/`
              }
            }
          }
        ],
        Inputs: [
          {
            AudioSelectors: {
              "Audio Selector 1": {
                DefaultSelection: "DEFAULT"
              }
            },
            VideoSelector: {
              Rotate: "AUTO"
            },
            TimecodeSource: "ZEROBASED",
            FileInput: fileInput
          }
        ]
      },
      AccelerationSettings: {
        Mode: "DISABLED"
      },
      StatusUpdateInterval: "SECONDS_60",
      Priority: 0,
    });
    await client.send(command);

    return video;
  }
}
