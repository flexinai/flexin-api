// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // No access if authorization details are missing
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], ['id', 'name', 'roles']);
    currentUser = {[securityId]: user.id, name: user.name, roles: user.roles};
  } else {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roles) {
    return AuthorizationDecision.DENY;
  }

  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {
    return AuthorizationDecision.ALLOW;
  }

  console.log('Checking allowedRoles: ', metadata.allowedRoles);
  let roleIsAllowed = false;
  for (const role of currentUser.roles) {
    console.log('User has role ', role);
    if (metadata.allowedRoles!.includes(role)) {
      roleIsAllowed = true;
      break;
    }
  }

  if (!roleIsAllowed) {
    return AuthorizationDecision.DENY;
  }

  // Admin account bypasses id verification
  if (currentUser.roles.includes('admin')) {
    return AuthorizationDecision.ALLOW;
  }

  /**
   * Allow access only to model owners, using route as source of truth
   *
   * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
   */
  console.log('Checking {userId} parameter: ', authorizationCtx.invocationContext.args[0]);
  console.log('Checking {userId} parameter type: ', typeof authorizationCtx.invocationContext.args[0]);
  console.log('current user has securityId: ', currentUser[securityId]);
  console.log('current user has securityId type', typeof currentUser[securityId]);
  if (currentUser[securityId] == authorizationCtx.invocationContext.args[0]) {
    return AuthorizationDecision.ALLOW;
  }

  return AuthorizationDecision.DENY;
}
