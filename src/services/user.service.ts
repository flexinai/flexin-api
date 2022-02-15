import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ManagementClient} from 'auth0';
require('dotenv').config()

const management = new ManagementClient({
  clientId: 'ospPrIAuZWQqMOh3RYDeILRTQR5CSY3i',
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: 'dev-e-vh6xi2.us.auth0.com',
});

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(/* Add @inject to inject parameters */) {}

  async getEmail(userId: string) {
    const user = await management.getUser({ id: userId })

    if (user.email) {
      return user.email;
    }

    throw Error('no user found');
  }

  async getUser(userId: string) {
    const user = await management.getUser({ id: userId })
    return user;
  }
}
