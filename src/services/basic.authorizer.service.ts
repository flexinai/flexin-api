// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function roleMatch(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  console.log("==Role Match?==");
  // No access if user's authentication details are missing
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], ['id', 'name', 'roles']);
    currentUser = {[securityId]: user.id, name: user.name, roles: user.roles};
  } else {
    return AuthorizationDecision.DENY;
  }

  // No access if user roles are missing
  if (!currentUser.roles) {
    return AuthorizationDecision.DENY;
  }

  // Allow access if user has 'admin' role
  if (currentUser.roles.includes('admin')) {
    console.log("User had admin role: ALLOW");
    return AuthorizationDecision.ALLOW;
  }

  // Otherwise deny if allowedRoles not specified
  if (!metadata.allowedRoles) {
    console.log("allowedRoles not specified: DENY")
    return AuthorizationDecision.DENY;
  }

  // Check users roles against the specified allowedRoles
  console.log('Checking allowedRoles: ', metadata.allowedRoles);
  for (const role of currentUser.roles) {
    console.log('User has role ', role);
    if (metadata.allowedRoles!.includes(role)) {
      console.log("ALLOW");
      return AuthorizationDecision.ALLOW;
    }
  }

  console.log("User does not have an allowedRole: DENY");
  return AuthorizationDecision.DENY;

}

export async function roleAndIdMatch(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  console.log("==Role and ID Match?==");
  // No access if user's authentication details are missing
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], ['id', 'name', 'roles']);
    currentUser = {[securityId]: user.id, name: user.name, roles: user.roles};
  } else {
    return AuthorizationDecision.DENY;
  }

  // No access if user roles are missing
  if (!currentUser.roles) {
    return AuthorizationDecision.DENY;
  }

  // Allow access if user has 'admin' role
  if (currentUser.roles.includes('admin')) {
    console.log("User had admin role: ALLOW");
    return AuthorizationDecision.ALLOW;
  }

  // Otherwise deny if allowedRoles not specified
  if (!metadata.allowedRoles) {
    console.log("allowedRoles not specified: DENY")
    return AuthorizationDecision.DENY;
  }

  // Check user's roles against the specified allowedRoles
  console.log('Checking allowedRoles: ', metadata.allowedRoles);
  for (const role of currentUser.roles) {
    console.log('User has role ', role);
    if (metadata.allowedRoles!.includes(role)) {
      console.log("ALLOW");
      return AuthorizationDecision.ALLOW;
    }
  }

  /**
   * Allow access only to model owners, using route as source of truth
   *
   * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
   */
  console.log('Checking {userId} parameter: ', authorizationCtx.invocationContext.args[0]);
  console.log('current user has securityId: ', currentUser[securityId]);
  if (currentUser[securityId] == authorizationCtx.invocationContext.args[0]) {
    console.log("User ID matches: ALLOW");
    return AuthorizationDecision.ALLOW;
  }

  console.log("User ID does not match: DENY");
  return AuthorizationDecision.DENY;
}
