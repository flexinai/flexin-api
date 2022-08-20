import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {Overlay, Review} from '../models';
import {OverlayRepository, ReviewRepository} from '../repositories';
import {UserService, VideoUploadService} from '../services';
import {UPLOADTYPES, VIEWS} from '../utils/enums';

// generates a filename like '20211008T194252702Z.mp4'
const generateFileName = (extension = '.mp4') => {
  const d = new Date();
  return d.toISOString().replace(/[:.-]/g, '') + extension;
};

export class ReviewController {
  constructor(
    @repository(ReviewRepository)
    public reviewRepository: ReviewRepository,
    @repository(OverlayRepository)
    public overlayRepository: OverlayRepository,
    @inject('services.VideoUploadService')
    protected videoUploadService: VideoUploadService,
    @inject('services.UserService')
    protected userService: UserService,
  ) {}

  @post('/reviews')
  @response(200, {
    description: 'Review model instance',
    content: {'application/json': {schema: getModelSchemaRef(Review)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Review, {
            title: 'NewVideo',
            // exclude: ['id'],
          }),
        },
      },
    })
    review: Review,
  ): Promise<Review> {
    const finishedReview = await this.reviewRepository.create(review);
    await this.videoUploadService.sendJob(finishedReview, UPLOADTYPES.REVIEW);
    return finishedReview;
  }

  @get('/reviews/count')
  @response(200, {
    description: 'Review model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Review) where?: Where<Review>): Promise<Count> {
    return this.reviewRepository.count(where);
  }

  @authenticate({strategy: 'auth0-jwt', options: {scopes: ['read:reviews']}})
  @get('/reviews')
  @response(200, {
    description: 'Array of Review model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Review, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Review) filter?: Filter<Review>): Promise<Review[]> {
    return this.reviewRepository.find(filter);
  }

  @get('/mobile/reviews')
  @response(200, {
    description: 'Array of Review model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Review, {includeRelations: true}),
        },
      },
    },
  })
  async findMobile(@param.filter(Review) filter?: Filter<Review>): Promise<Review[]> {
    return this.reviewRepository.find(filter);
  }

  @patch('/reviews')
  @response(200, {
    description: 'Review PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Review, {partial: true}),
        },
      },
    })
    review: Review,
    @param.where(Review) where?: Where<Review>,
  ): Promise<Count> {
    return this.reviewRepository.updateAll(review, where);
  }

  @get('/reviews/{id}')
  @response(200, {
    description: 'Review model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Review, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Review, {exclude: 'where'}) filter?: FilterExcludingWhere<Review>,
  ): Promise<Review> {
    return this.reviewRepository.findById(id, filter);
  }

  @patch('/reviews/{id}')
  @response(204, {
    description: 'Review PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Review, {partial: true}),
        },
      },
    })
    review: Review,
  ): Promise<void> {
    await this.reviewRepository.updateById(id, review);
  }

  @put('/reviews/{id}')
  @response(204, {
    description: 'Review PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() review: Review): Promise<void> {
    await this.reviewRepository.replaceById(id, review);
  }

  @del('/reviews/{id}')
  @response(204, {
    description: 'Review DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const review = await this.reviewRepository.findById(id);
    await this.videoUploadService.deleteS3Video(review.url);
    await this.reviewRepository.deleteById(id);
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
    const isPhoto = uploadType === UPLOADTYPES.THUMBNAIL || uploadType === UPLOADTYPES.PROFILE_PHOTO;
    const fileName = isPhoto ? generateFileName('.jpg') : generateFileName('.mp4');
    const url = await this.videoUploadService.getUploadUrl(fileName, uploadType);
    return {url};
  }

  @post('/overlays')
  @response(204, {
    description: 'Overlay POST success',
  })
  async patchFromS3(
    @requestBody()
    request: {
      url: string;
      view: string;
    },
  ): Promise<Overlay> {
    const {url, view} = request;
    const baseUrl = 'https://flexin-video.s3.us-east-2.amazonaws.com/';
    const key = url.split(baseUrl)[1];
    const file = key.split(`views/${view}`)[1];
    let reviewUrl = `${baseUrl}review${file}`;
    if (view === VIEWS.CALCULATE) {
      reviewUrl = reviewUrl.replace('json', 'mp4');
    }

    const review = await this.reviewRepository.findOne({
      where: {
        url: reviewUrl,
      },
    });

    const overlay: Partial<Overlay> = {
      url,
      reviewId: review?.id,
      view,
    };

    return this.overlayRepository.create(overlay);
  }
}
