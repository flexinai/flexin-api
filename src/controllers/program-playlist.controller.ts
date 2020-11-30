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
  Playlist,
} from '../models';
import {ProgramRepository} from '../repositories';

export class ProgramPlaylistController {
  constructor(
    @repository(ProgramRepository) protected programRepository: ProgramRepository,
  ) { }

  @get('/programs/{id}/playlist', {
    responses: {
      '200': {
        description: 'Program has one Playlist',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Playlist),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Playlist>,
  ): Promise<Playlist> {
    return this.programRepository.playlist(id).get(filter);
  }

  @post('/programs/{id}/playlist', {
    responses: {
      '200': {
        description: 'Program model instance',
        content: {'application/json': {schema: getModelSchemaRef(Playlist)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Program.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Playlist, {
            title: 'NewPlaylistInProgram',
            exclude: ['id'],
            optional: ['programId']
          }),
        },
      },
    }) playlist: Omit<Playlist, 'id'>,
  ): Promise<Playlist> {
    return this.programRepository.playlist(id).create(playlist);
  }

  @patch('/programs/{id}/playlist', {
    responses: {
      '200': {
        description: 'Program.Playlist PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Playlist, {partial: true}),
        },
      },
    })
    playlist: Partial<Playlist>,
    @param.query.object('where', getWhereSchemaFor(Playlist)) where?: Where<Playlist>,
  ): Promise<Count> {
    return this.programRepository.playlist(id).patch(playlist, where);
  }

  @del('/programs/{id}/playlist', {
    responses: {
      '200': {
        description: 'Program.Playlist DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Playlist)) where?: Where<Playlist>,
  ): Promise<Count> {
    return this.programRepository.playlist(id).delete(where);
  }
}
