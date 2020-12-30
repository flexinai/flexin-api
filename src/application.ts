import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

// --- Authentication ----
import {createBindingFromClass} from '@loopback/core';
import {AuthenticationComponent} from '@loopback/authentication';
import {
  Oauth2AuthStrategy,
  GoogleOauth2Authentication,
} from './authentication-strategies';
import {CustomOauth2, GoogleOauth} from './authentication-strategy-providers';
import {PassportUserIdentityService, UserServiceBindings} from './services';
import passport from 'passport';
import {
  JWTAuthenticationComponent,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
// ----------------------

export {ApplicationConfig};

export class FlexinApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // ---- Authentication ----

    // get oAuth configuration
    let oAuth2Providers = require('../oauth2-providers.json');
    oAuth2Providers['google-login'].clientID = process.env.CLIENT_ID;
    oAuth2Providers['google-login'].clientSecret = process.env.CLIENT_SECRET;

    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.setUpBindings();

    this.bind('googleOAuth2Options').to(oAuth2Providers['google-login']);
    this.bind('customOAuth2Options').to(oAuth2Providers['oauth2']);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.serializeUser(function (user: any, done) {
      done(null, user);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.deserializeUser(function (user: any, done) {
      done(null, user);
    });
    // -------------------------

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

  setUpBindings(): void {
    this.bind(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(
      PassportUserIdentityService,
    );
    // JWT
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      process.env.TOKEN_SECRET || 'SuperSecureTokens3cr3t',
    );
    // passport strategies
    this.add(createBindingFromClass(GoogleOauth, {key: 'googleStrategy'}));
    this.add(createBindingFromClass(CustomOauth2, {key: 'oauth2Strategy'}));
    // LoopBack 4 style authentication strategies
    this.add(createBindingFromClass(GoogleOauth2Authentication));
    this.add(createBindingFromClass(Oauth2AuthStrategy));
  }
}
