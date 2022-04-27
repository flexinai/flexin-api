import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ManagementClient, User} from 'auth0';
require('dotenv').config()

const management = new ManagementClient({
  clientId: 'ospPrIAuZWQqMOh3RYDeILRTQR5CSY3i',
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: 'dev-e-vh6xi2.us.auth0.com',
});

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(/* Add @inject to inject parameters */) {}

  async getUser(userId: string) {
    const user = await management.getUser({ id: userId })
    return user;
  }

  async updateUser(userId: string, user: Partial<User>) {

    return management.updateUser({ id: userId }, user);
  }
}
