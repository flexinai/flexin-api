import {CreateJobCommand, MediaConvertClient} from '@aws-sdk/client-mediaconvert';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {BindingScope, injectable} from '@loopback/core';

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

  async sendJob() {
    const client = new MediaConvertClient({
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: 'https://mqm13wgra.mediaconvert.us-east-2.amazonaws.com'
    });
    const command = new CreateJobCommand({
      Queue: "arn:aws:mediaconvert:us-east-2:816488412071:queues/Default",
      UserMetadata: {},
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
                EndTimecode: "00:10:10:00",
                StartTimecode: "00:10:00:00"
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
            FileInput: "s3://flexin-video/20211025T125853401Z.mp4"
          }
        ]
      },
      AccelerationSettings: {
        Mode: "DISABLED"
      },
      StatusUpdateInterval: "SECONDS_60",
      Priority: 0
    });
    const response = await client.send(command);
    console.log(response)
    console.log({response})
    return response
  }
}
