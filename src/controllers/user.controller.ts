import {authenticate} from '@loopback/authentication';
import {
  get
} from '@loopback/rest';
import {ManagementClient, User} from 'auth0';

const management = new ManagementClient({
  clientId: 'ospPrIAuZWQqMOh3RYDeILRTQR5CSY3i',
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: 'dev-e-vh6xi2.us.auth0.com',
});

export class UserController {
  @authenticate({strategy: 'auth0-jwt', options: {scopes: ['read:users']}})
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
}
