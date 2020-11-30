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
  Program,
  Workout,
} from '../models';
import {ProgramRepository} from '../repositories';

export class ProgramWorkoutController {
  constructor(
    @repository(ProgramRepository) protected programRepository: ProgramRepository,
  ) { }

  @get('/programs/{id}/workouts', {
    responses: {
      '200': {
        description: 'Array of Program has many Workout',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Workout)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Workout>,
  ): Promise<Workout[]> {
    return this.programRepository.workouts(id).find(filter);
  }

  @post('/programs/{id}/workouts', {
    responses: {
      '200': {
        description: 'Program model instance',
        content: {'application/json': {schema: getModelSchemaRef(Workout)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Program.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workout, {
            title: 'NewWorkoutInProgram',
            exclude: ['id'],
            optional: ['programId']
          }),
        },
      },
    }) workout: Omit<Workout, 'id'>,
  ): Promise<Workout> {
    return this.programRepository.workouts(id).create(workout);
  }

  @patch('/programs/{id}/workouts', {
    responses: {
      '200': {
        description: 'Program.Workout PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workout, {partial: true}),
        },
      },
    })
    workout: Partial<Workout>,
    @param.query.object('where', getWhereSchemaFor(Workout)) where?: Where<Workout>,
  ): Promise<Count> {
    return this.programRepository.workouts(id).patch(workout, where);
  }

  @del('/programs/{id}/workouts', {
    responses: {
      '200': {
        description: 'Program.Workout DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Workout)) where?: Where<Workout>,
  ): Promise<Count> {
    return this.programRepository.workouts(id).delete(where);
  }
}
