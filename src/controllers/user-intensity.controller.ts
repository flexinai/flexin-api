import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {User, Intensity} from '../models';
import {UserRepository} from '../repositories';

export class UserIntensityController {
  constructor(@repository(UserRepository) protected userRepository: UserRepository) {}

  @get('/users/{id}/intensities-created', {
    responses: {
      '200': {
        description: 'Array of User has many Intensity',
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
    return this.userRepository.intensitiesCreated(id).find(filter);
  }

  @patch('/users/{id}/intensities-created', {
    responses: {
      '200': {
        description: 'User.Intensity PATCH success count',
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
    return this.userRepository.intensitiesCreated(id).patch(intensity, where);
  }

  @del('/users/{id}/intensities-created', {
    responses: {
      '200': {
        description: 'User.Intensity DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Intensity)) where?: Where<Intensity>,
  ): Promise<Count> {
    return this.userRepository.intensitiesCreated(id).delete(where);
  }
}
