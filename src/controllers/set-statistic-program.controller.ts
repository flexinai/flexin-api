import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SetStatistic,
  Program,
} from '../models';
import {SetStatisticRepository} from '../repositories';

export class SetStatisticProgramController {
  constructor(
    @repository(SetStatisticRepository)
    public setStatisticRepository: SetStatisticRepository,
  ) { }

  @get('/set-statistics/{id}/program', {
    responses: {
      '200': {
        description: 'Program belonging to SetStatistic',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Program)},
          },
        },
      },
    },
  })
  async getProgram(
    @param.path.number('id') id: typeof SetStatistic.prototype.id,
  ): Promise<Program> {
    return this.setStatisticRepository.program(id);
  }
}
