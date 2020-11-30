import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Playlist} from '../models';
import {PlaylistRepository} from '../repositories';

export class PlaylistController {
  constructor(
    @repository(PlaylistRepository)
    public playlistRepository : PlaylistRepository,
  ) {}

  @post('/playlists', {
    responses: {
      '200': {
        description: 'Playlist model instance',
        content: {'application/json': {schema: getModelSchemaRef(Playlist)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Playlist, {
            title: 'NewPlaylist',
            exclude: ['id'],
          }),
        },
      },
    })
    playlist: Omit<Playlist, 'id'>,
  ): Promise<Playlist> {
    return this.playlistRepository.create(playlist);
  }

  @get('/playlists/count', {
    responses: {
      '200': {
        description: 'Playlist model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Playlist) where?: Where<Playlist>,
  ): Promise<Count> {
    return this.playlistRepository.count(where);
  }

  @get('/playlists', {
    responses: {
      '200': {
        description: 'Array of Playlist model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Playlist, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Playlist) filter?: Filter<Playlist>,
  ): Promise<Playlist[]> {
    return this.playlistRepository.find(filter);
  }

  @patch('/playlists', {
    responses: {
      '200': {
        description: 'Playlist PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Playlist, {partial: true}),
        },
      },
    })
    playlist: Playlist,
    @param.where(Playlist) where?: Where<Playlist>,
  ): Promise<Count> {
    return this.playlistRepository.updateAll(playlist, where);
  }

  @get('/playlists/{id}', {
    responses: {
      '200': {
        description: 'Playlist model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Playlist, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Playlist, {exclude: 'where'}) filter?: FilterExcludingWhere<Playlist>
  ): Promise<Playlist> {
    return this.playlistRepository.findById(id, filter);
  }

  @patch('/playlists/{id}', {
    responses: {
      '204': {
        description: 'Playlist PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Playlist, {partial: true}),
        },
      },
    })
    playlist: Playlist,
  ): Promise<void> {
    await this.playlistRepository.updateById(id, playlist);
  }

  @put('/playlists/{id}', {
    responses: {
      '204': {
        description: 'Playlist PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() playlist: Playlist,
  ): Promise<void> {
    await this.playlistRepository.replaceById(id, playlist);
  }

  @del('/playlists/{id}', {
    responses: {
      '204': {
        description: 'Playlist DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.playlistRepository.deleteById(id);
  }
}
