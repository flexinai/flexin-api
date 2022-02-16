import {inject} from '@loopback/core';
import {
  get, param, patch, requestBody
} from '@loopback/rest';
import {ManagementClient, User} from 'auth0';
import {UserService} from '../services';

const management = new ManagementClient({
  clientId: 'ospPrIAuZWQqMOh3RYDeILRTQR5CSY3i',
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: 'dev-e-vh6xi2.us.auth0.com',
});

export class UserController {
  constructor(
    @inject('services.UserService')
    protected userService: UserService,
  ) {

  }
  @get('/users/coach', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
          },
        },
      },
    },
  })
  async find(
  ): Promise<void | User[]> {
    return management
      .getUsersInRole({
        id: 'rol_sS8Czj1uRntdt7dF'
      })
      .catch((err: unknown) => {
        console.error(err)
      });
  }

  @get('/users/coach/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async findOne(
    @param.path.string('id') id: string,
  ): Promise<void | User> {
    return management
      .getUser({
        id
      })
      .catch((err: unknown) => {
        console.error(err)
      });
  }

  @patch('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async patchOne(
    @param.path.string('id') id: string,
    @requestBody() user: User
  ): Promise<void | User> {
    return this.userService.updateUser(id, user)
  }
}
