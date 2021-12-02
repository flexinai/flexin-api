import {CreateJobCommand, MediaConvertClient} from '@aws-sdk/client-mediaconvert';
import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {BindingScope, injectable} from '@loopback/core';
import {Clip, Video} from '../models';
import {millisecondsToHHMMSSFF} from '../utils/milliseconds-to-hhmmssff';



@injectable({scope: BindingScope.TRANSIENT})
export class VideoUploadService {

  getUploadUrl(fileName: string): Promise<string> {
    const client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
    const command = new PutObjectCommand({
      Bucket: 'flexin-video',
      Key: fileName,
      ContentType: 'application/octet-stream',
    });
    const url = getSignedUrl(client, command, { expiresIn: 300 });
    return url
  }

  deleteS3Video(url?: string) {
    if (!url) {
      return;
    }

    const fileName = url.split('https://flexin-video.s3.us-east-2.amazonaws.com/')[1]
    const client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
    const command = new DeleteObjectCommand({
      Bucket: 'flexin-video',
      Key: fileName,
    });
    return client.send(command);
  }

  async sendJob(video: Video, clip: Clip) {
    const startTimecode = millisecondsToHHMMSSFF(clip.startMilliseconds)
    const endTimecode = millisecondsToHHMMSSFF(clip.endMilliseconds)
    const fileInput = video.url
    const client = new MediaConvertClient({
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: 'https://mqm13wgra.mediaconvert.us-east-2.amazonaws.com'
    });
    const command = new CreateJobCommand({
      Queue: "arn:aws:mediaconvert:us-east-2:816488412071:queues/Default",
      UserMetadata: {
        clip: `${clip.id}`
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
                NameModifier: "-1"
              }
            ],
            OutputGroupSettings: {
              Type: "FILE_GROUP_SETTINGS",
              FileGroupSettings: {
                Destination: "s3://flexin-video/"
              }
            }
          }
        ],
        Inputs: [
          {
            InputClippings: [
              {
                EndTimecode: endTimecode,
                StartTimecode: startTimecode
              }
            ],
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

    return clip;
  }
}
