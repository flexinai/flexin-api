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
  Intensity,
} from '../models';
import {ExerciseRepository} from '../repositories';

export class ExerciseIntensityController {
  constructor(
    @repository(ExerciseRepository) protected exerciseRepository: ExerciseRepository,
  ) { }

  @get('/exercises/{id}/intensities', {
    responses: {
      '200': {
        description: 'Array of Exercise has many Intensity',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Intensity)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Intensity>,
  ): Promise<Intensity[]> {
    return this.exerciseRepository.intensities(id).find(filter);
  }

  @post('/exercises/{id}/intensities', {
    responses: {
      '200': {
        description: 'Exercise model instance',
        content: {'application/json': {schema: getModelSchemaRef(Intensity)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Exercise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intensity, {
            title: 'NewIntensityInExercise',
            exclude: ['id'],
            optional: ['exerciseId']
          }),
        },
      },
    }) intensity: Omit<Intensity, 'id'>,
  ): Promise<Intensity> {
    return this.exerciseRepository.intensities(id).create(intensity);
  }

  @patch('/exercises/{id}/intensities', {
    responses: {
      '200': {
        description: 'Exercise.Intensity PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intensity, {partial: true}),
        },
      },
    })
    intensity: Partial<Intensity>,
    @param.query.object('where', getWhereSchemaFor(Intensity)) where?: Where<Intensity>,
  ): Promise<Count> {
    return this.exerciseRepository.intensities(id).patch(intensity, where);
  }

  @del('/exercises/{id}/intensities', {
    responses: {
      '200': {
        description: 'Exercise.Intensity DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Intensity)) where?: Where<Intensity>,
  ): Promise<Count> {
    return this.exerciseRepository.intensities(id).delete(where);
  }
}
