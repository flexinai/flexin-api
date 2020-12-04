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
  Exercise,
  DemonstrationVideo,
} from '../models';
import {ExerciseRepository} from '../repositories';

export class ExerciseDemonstrationVideoController {
  constructor(
    @repository(ExerciseRepository) protected exerciseRepository: ExerciseRepository,
  ) { }

  @get('/exercises/{id}/demonstration-videos', {
    responses: {
      '200': {
        description: 'Array of Exercise has many DemonstrationVideo',
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
    return this.exerciseRepository.demonstrationVideos(id).find(filter);
  }

  @post('/exercises/{id}/demonstration-videos', {
    responses: {
      '200': {
        description: 'Exercise model instance',
        content: {'application/json': {schema: getModelSchemaRef(DemonstrationVideo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Exercise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemonstrationVideo, {
            title: 'NewDemonstrationVideoInExercise',
            exclude: ['id'],
            optional: ['exerciseId']
          }),
        },
      },
    }) demonstrationVideo: Omit<DemonstrationVideo, 'id'>,
  ): Promise<DemonstrationVideo> {
    return this.exerciseRepository.demonstrationVideos(id).create(demonstrationVideo);
  }

  @patch('/exercises/{id}/demonstration-videos', {
    responses: {
      '200': {
        description: 'Exercise.DemonstrationVideo PATCH success count',
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
    return this.exerciseRepository.demonstrationVideos(id).patch(demonstrationVideo, where);
  }

  @del('/exercises/{id}/demonstration-videos', {
    responses: {
      '200': {
        description: 'Exercise.DemonstrationVideo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DemonstrationVideo)) where?: Where<DemonstrationVideo>,
  ): Promise<Count> {
    return this.exerciseRepository.demonstrationVideos(id).delete(where);
  }
}
