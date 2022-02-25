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
  response,
} from '@loopback/rest';
import {Reply} from '../models';
import {ReplyRepository} from '../repositories';

export class ReplyController {
  constructor(
    @repository(ReplyRepository)
    public replyRepository : ReplyRepository,
  ) {}

  @post('/replies')
  @response(200, {
    description: 'Reply model instance',
    content: {'application/json': {schema: getModelSchemaRef(Reply)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reply, {
            title: 'NewReply',
            exclude: ['id'],
          }),
        },
      },
    })
    reply: Omit<Reply, 'id'>,
  ): Promise<Reply> {
    return this.replyRepository.create(reply);
  }

  @get('/replies/count')
  @response(200, {
    description: 'Reply model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Reply) where?: Where<Reply>,
  ): Promise<Count> {
    return this.replyRepository.count(where);
  }

  @get('/replies')
  @response(200, {
    description: 'Array of Reply model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Reply, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Reply) filter?: Filter<Reply>,
  ): Promise<Reply[]> {
    return this.replyRepository.find(filter);
  }

  @patch('/replies')
  @response(200, {
    description: 'Reply PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reply, {partial: true}),
        },
      },
    })
    reply: Reply,
    @param.where(Reply) where?: Where<Reply>,
  ): Promise<Count> {
    return this.replyRepository.updateAll(reply, where);
  }

  @get('/replies/{id}')
  @response(200, {
    description: 'Reply model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Reply, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Reply, {exclude: 'where'}) filter?: FilterExcludingWhere<Reply>
  ): Promise<Reply> {
    return this.replyRepository.findById(id, filter);
  }

  @patch('/replies/{id}')
  @response(204, {
    description: 'Reply PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reply, {partial: true}),
        },
      },
    })
    reply: Reply,
  ): Promise<void> {
    await this.replyRepository.updateById(id, reply);
  }

  @put('/replies/{id}')
  @response(204, {
    description: 'Reply PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() reply: Reply,
  ): Promise<void> {
    await this.replyRepository.replaceById(id, reply);
  }

  @del('/replies/{id}')
  @response(204, {
    description: 'Reply DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.replyRepository.deleteById(id);
  }
}
