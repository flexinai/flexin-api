import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  DemonstrationVideo,
} from '../models';
import {UserRepository} from '../repositories';

export class UserDemonstrationVideoController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/demonstration-videos', {
    responses: {
      '200': {
        description: 'Array of User has many DemonstrationVideo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DemonstrationVideo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DemonstrationVideo>,
  ): Promise<DemonstrationVideo[]> {
    return this.userRepository.demonstrationVideos(id).find(filter);
  }

  @post('/users/{id}/demonstration-videos', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(DemonstrationVideo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemonstrationVideo, {
            title: 'NewDemonstrationVideoInUser',
            exclude: ['id'],
            optional: ['createdById']
          }),
        },
      },
    }) demonstrationVideo: Omit<DemonstrationVideo, 'id'>,
  ): Promise<DemonstrationVideo> {
    return this.userRepository.demonstrationVideos(id).create(demonstrationVideo);
  }

  @patch('/users/{id}/demonstration-videos', {
    responses: {
      '200': {
        description: 'User.DemonstrationVideo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemonstrationVideo, {partial: true}),
        },
      },
    })
    demonstrationVideo: Partial<DemonstrationVideo>,
    @param.query.object('where', getWhereSchemaFor(DemonstrationVideo)) where?: Where<DemonstrationVideo>,
  ): Promise<Count> {
    return this.userRepository.demonstrationVideos(id).patch(demonstrationVideo, where);
  }

  @del('/users/{id}/demonstration-videos', {
    responses: {
      '200': {
        description: 'User.DemonstrationVideo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DemonstrationVideo)) where?: Where<DemonstrationVideo>,
  ): Promise<Count> {
    return this.userRepository.demonstrationVideos(id).delete(where);
  }
}
