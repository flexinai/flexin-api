import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Video} from '../models';
import {VideoRepository} from '../repositories';
import {EmailMessage, EmailService, VideoUploadService} from '../services';
import {processingTemplate, reviewedTemplate} from '../templates';
import {STATUSES, VIDEOTYPES} from '../utils/enums';

// generates a filename like '20211008T194252702Z.mp4'
const generateFileName = (extension = '.mp4') => {
  const d = new Date();
  return d.toISOString().replace(/[:.-]/g, '') + extension;
};

export class VideoController {
  constructor(
    @repository(VideoRepository)
    public videoRepository: VideoRepository,
    @inject('services.VideoUploadService')
    protected videoUploadService: VideoUploadService,
    @inject('services.EmailService')
    protected emailService: EmailService,
  ) {}

  @post('/videos')
  @response(200, {
    description: 'Video model instance',
    content: {'application/json': {schema: getModelSchemaRef(Video)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {
            title: 'NewVideo',
            // exclude: ['id'],
          }),
        },
      },
    })
    video: Video,
  ): Promise<Video> {
    const emailResponse = await this.sendProcessingEmail(video.createdById);
    if (emailResponse[0] && emailResponse[0].status === 'sent') {
      video.processingEmailSent = new Date();
    } else {
      console.log(emailResponse);
    }
    const finishedVideo = await this.videoRepository.create(video);
    return finishedVideo;
  }

  @get('/videos/count')
  @response(200, {
    description: 'Video model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Video) where?: Where<Video>): Promise<Count> {
    return this.videoRepository.count(where);
  }

  @authenticate({strategy: 'auth0-jwt', options: {scopes: ['read:videos']}})
  @get('/videos')
  @response(200, {
    description: 'Array of Video model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Video, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Video) filter?: Filter<Video>): Promise<Video[]> {
    return this.videoRepository.find(filter);
  }

  @patch('/videos')
  @response(200, {
    description: 'Video PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {partial: true}),
        },
      },
    })
    video: Video,
    @param.where(Video) where?: Where<Video>,
  ): Promise<Count> {
    return this.videoRepository.updateAll(video, where);
  }

  @get('/videos/{id}')
  @response(200, {
    description: 'Video model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Video, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Video, {exclude: 'where'}) filter?: FilterExcludingWhere<Video>,
  ): Promise<Video> {
    return this.videoRepository.findById(id, filter);
  }

  @patch('/videos/{id}')
  @response(204, {
    description: 'Video PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {partial: true}),
        },
      },
    })
    video: Video,
  ): Promise<void> {
    const currentVideo = await this.videoRepository.findById(id);
    // if video status is changing from 'valid' to 'reviewed', send the 'video reviewed' email
    if (currentVideo.status === 'valid' && video.status === 'reviewed') {
      const emailResponse = await this.sendVideoReviewedEmail(currentVideo.createdById, id);
      if (emailResponse[0] && emailResponse[0].status === 'sent') {
        video.reviewedEmailSent = new Date();
      } else {
        console.log(emailResponse);
      }
    }
    await this.videoRepository.updateById(id, video);
  }

  @put('/videos/{id}')
  @response(204, {
    description: 'Video PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() video: Video
  ): Promise<void> {
    const currentVideo = await this.videoRepository.findById(id);
    // if video status is changing from valid to reviewed, send the "video reviewed" email
    if (currentVideo.status === STATUSES.VALID && video.status === STATUSES.REVIEWED) {
      const emailResponse = await this.sendVideoReviewedEmail(video.createdById, id);
      if (emailResponse[0] && emailResponse[0].status === 'sent') {
        video.reviewedEmailSent = new Date();
      } else {
        console.log(emailResponse);
      }
    }
    await this.videoRepository.replaceById(id, video);
  }

  @del('/videos/{id}')
  @response(204, {
    description: 'Video DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const video = await this.videoRepository.findById(id);
    await this.videoUploadService.deleteS3Video(video.url);
    await this.videoRepository.deleteById(id);
  }

  @get('/upload-url/{videoType}', {
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
  async uploadUrl(@param.path.string('videoType') videoType: VIDEOTYPES) {
    const isThumbnail = videoType === VIDEOTYPES.THUMBNAIL;
    const fileName = isThumbnail ? generateFileName('.jpg') : generateFileName('.mp4');
    const url = await this.videoUploadService.getUploadUrl(fileName, videoType);
    return { url };
  }


  private sendProcessingEmail(emailAddress: string): Promise<any> {
    const email: EmailMessage = {
      subject: 'flexin: processing your video now',
      html: processingTemplate(),
      to: [{email: emailAddress, type: 'to'}],
    };
    return this.emailService.send(email);
  }

  private sendVideoReviewedEmail(emailAddress: string, videoId: number): Promise<any> {
    const email: EmailMessage = {
      subject: 'flexin: video review ready',
      html: reviewedTemplate(videoId),
      to: [{email: emailAddress, type: 'to'}],
    };
    return this.emailService.send(email);
  }
}
