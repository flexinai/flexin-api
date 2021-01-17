import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody} from '@loopback/rest';
import {Program} from '../models';
import {ProgramRepository} from '../repositories';
import {inject} from '@loopback/core';
import {authenticate, TokenService} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {TokenServiceBindings, UserServiceBindings, MyUserService} from '@loopback/authentication-jwt';
import {UserRepository} from '../repositories';

export class SelfController {
  constructor(
    @repository(ProgramRepository)
    public programRepository: ProgramRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true}) private user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @get('/self')
  async whoAmI(): Promise<object> {
    // return this.user[securityId];
    const userProfile = await this.userRepository.findById(parseInt(this.user[securityId]));
    return userProfile;
  }

  // programs created by or assigned to the current user
  @authenticate('jwt')
  @get('/self/programs', {
    responses: {
      '200': {
        description: 'Array of Program model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Program, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findCreatedOrAssigned(): Promise<Program[]> {
    const createdByFilter = {
      where: {createdById: this.user.id},
    };
    // get programs created by user
    const programs = await this.programRepository.find(createdByFilter);
    // add and return programs assigned to the current user
    return programs.concat(await this.userRepository.programs(this.user.id).find());
  }
}
