import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTAuthenticationStrategy, KEY} from './authentication-strategies';
import {MySequence} from './sequence';
import {JWTServiceProvider} from './services';

// ----------------------

export {ApplicationConfig};

export class FlexinApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // ---- Auth0 ----
     // Bind authentication component related elements
     this.component(AuthenticationComponent);

     this.service(JWTServiceProvider);

     // Register the Auth0 JWT authentication strategy
     registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

     this.configure(KEY).to({
       jwksUri: 'https://dev-e-vh6xi2.us.auth0.com/.well-known/jwks.json',
       audience: 'https://api.flexin.io',
       issuer: 'https://dev-e-vh6xi2.us.auth0.com/',
       algorithms: ['RS256']
     });

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
