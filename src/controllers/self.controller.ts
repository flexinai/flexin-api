import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {UserRepository} from '../repositories';

export class SelfController {
  constructor(
    @inject(SecurityBindings.USER, {optional: true}) private user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/self')
  @authenticate('auth0-jwt')
  async self(): Promise<object> {
    // return this.user[securityId];
    const userProfile = await this.userRepository.findById(parseInt(this.user[securityId]));
    return userProfile;
  }

  @get('/hello')
  @authenticate({strategy: 'auth0-jwt', options: {scopes: ['greet']}})
  hello(): string {
    return 'Hello';
  }
}
