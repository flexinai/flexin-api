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
import {EmailMessage, EmailService, UserService, VideoUploadService} from '../services';
import {processingTemplate, reviewedTemplate, submissionRecievedTemplate} from '../templates';
import {UPLOADTYPES} from '../utils/enums';
import {validateEmail} from '../utils/validate-email';

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
    @inject('services.UserService')
    protected userService: UserService,
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
    await this.sendProcessingEmail(video.createdById);

    return this.videoRepository.create(video);;
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
    const isVideoReviewed = currentVideo.status === 'valid' && video.status === 'reviewed'
    const isVideoAssigned = !currentVideo.reviewedById && video.reviewedById
    if (isVideoReviewed) {
      await this.sendVideoReviewedEmail(currentVideo.createdById, id);
      video.reviewedEmailSent = new Date();
    }

    if (isVideoAssigned) {
      await this.sendReadyForCoachEmail(video.reviewedById, id);
      video.readyForCoachEmailSent = new Date();
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
    const isVideoReviewed = currentVideo.status === 'valid' && video.status === 'reviewed'
    const isVideoAssigned = !currentVideo.reviewedById && video.reviewedById
    if (isVideoReviewed) {
      await this.sendVideoReviewedEmail(currentVideo.createdById, id);
      video.reviewedEmailSent = new Date();
    }

    if (isVideoAssigned) {
      await this.sendReadyForCoachEmail(video.reviewedById, id);
      video.readyForCoachEmailSent = new Date();
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

  @get('/upload-url/{uploadType}', {
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
  async uploadUrl(@param.path.string('uploadType') uploadType: UPLOADTYPES) {
    const isPhoto = uploadType === UPLOADTYPES.THUMBNAIL || UPLOADTYPES.PROFILE_PHOTO;
    const fileName = isPhoto ? generateFileName('.jpg') : generateFileName('.mp4');
    const url = await this.videoUploadService.getUploadUrl(fileName, uploadType);
    return { url };
  }


  private async sendProcessingEmail(userId: string): Promise<void> {
    const email = validateEmail(userId) ? userId : await this.userService.getEmail(userId)
    const message: EmailMessage = {
      subject: 'flexin: processing your video now',
      html: processingTemplate(),
      to: [{email, type: 'to'}]
    };
    const emailResponse = await this.emailService.send(message);
    if (emailResponse[0]?.status === 'sent') {
      return;
    }

    throw emailResponse[0];
  }

  private async sendVideoReviewedEmail(userId: string, videoId: number): Promise<void> {
    const email = validateEmail(userId) ? userId : await this.userService.getEmail(userId)
    const message: EmailMessage = {
      subject: 'flexin: video review ready',
      html: reviewedTemplate(videoId),
      to: [{email, type: 'to'}]
    };
    const emailResponse = await this.emailService.send(message);
    if (emailResponse[0]?.status === 'sent') {
      return;
    }

    throw emailResponse[0];
  }

  private async sendReadyForCoachEmail(userId: string, videoId: number): Promise<void> {
    const email = validateEmail(userId) ? userId : await this.userService.getEmail(userId)
    const message: EmailMessage = {
      subject: 'flexin: new video for review',
      html: submissionRecievedTemplate(videoId),
      to: [{email, type: 'to'}]
    };
    const emailResponse = await this.emailService.send(message);
    if (emailResponse[0]?.status === 'sent') {
      return;
    }

    throw emailResponse[0];
  }
}
