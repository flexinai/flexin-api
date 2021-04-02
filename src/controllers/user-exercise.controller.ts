import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {User, Exercise} from '../models';
import {UserRepository} from '../repositories';

export class UserExerciseController {
  constructor(@repository(UserRepository) protected userRepository: UserRepository) {}

  @get('/users/{id}/exercises-created', {
    responses: {
      '200': {
        description: 'Array of User has many Exercise',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Exercise)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Exercise>,
  ): Promise<Exercise[]> {
    return this.userRepository.exercisesCreated(id).find(filter);
  }

  @post('/users/{id}/exercises-created', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Exercise)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {
            title: 'NewExerciseInUser',
            exclude: ['id'],
            optional: ['createdById'],
          }),
        },
      },
    })
    exercise: Omit<Exercise, 'id'>,
  ): Promise<Exercise> {
    return this.userRepository.exercisesCreated(id).create(exercise);
  }

  @patch('/users/{id}/exercises-created', {
    responses: {
      '200': {
        description: 'User.Exercise PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {partial: true}),
        },
      },
    })
    exercise: Partial<Exercise>,
    @param.query.object('where', getWhereSchemaFor(Exercise)) where?: Where<Exercise>,
  ): Promise<Count> {
    return this.userRepository.exercisesCreated(id).patch(exercise, where);
  }

  @del('/users/{id}/exercises-created', {
    responses: {
      '200': {
        description: 'User.Exercise DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Exercise)) where?: Where<Exercise>,
  ): Promise<Count> {
    return this.userRepository.exercisesCreated(id).delete(where);
  }
}
