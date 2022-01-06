
import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {ExpressRequestHandler, Request, Response, RestBindings} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {JWT_SERVICE} from './types';
const jwtAuthz = require('express-jwt-authz');


export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'auth0-jwt';

  constructor(
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
    @inject(JWT_SERVICE)
    private jwtCheck: ExpressRequestHandler,
  ) {
  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {

    return new Promise<UserProfile | undefined>((resolve, reject) => {
      this.jwtCheck(request, this.response, (err: unknown) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        // If the `@authenticate` requires `scopes` check
        if (this.metadata[0].options?.scopes) {
          jwtAuthz(this.metadata[0].options!.scopes, {failWithError: true, customScopeKey: 'permissions'})(
            request,
            this.response,
            (err2?: Error) => {
              if (err2) {
                console.error(err2);
                reject(err2);
                return;
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              resolve((request as any).user);
            },
          );
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolve((request as any).user);
        }
      });
    });
  }
}
