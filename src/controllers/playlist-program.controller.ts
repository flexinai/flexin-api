import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Playlist,
  Program,
} from '../models';
import {PlaylistRepository} from '../repositories';

export class PlaylistProgramController {
  constructor(
    @repository(PlaylistRepository)
    public playlistRepository: PlaylistRepository,
  ) { }

  @get('/playlists/{id}/program', {
    responses: {
      '200': {
        description: 'Program belonging to Playlist',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Program)},
          },
        },
      },
    },
  })
  async getProgram(
    @param.path.number('id') id: typeof Playlist.prototype.id,
  ): Promise<Program> {
    return this.playlistRepository.program(id);
  }
}
