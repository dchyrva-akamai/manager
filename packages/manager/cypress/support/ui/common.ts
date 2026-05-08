import { apiMatcher } from 'support/util/intercepts';

import type { StringMatcher } from 'support/cypress-exports';

type HttpMethod =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export const waitForAppLoad = (path = '/', withLogin = true) => {
  cy.intercept('GET', apiMatcher('account')).as('getAccount');
  cy.intercept('GET', apiMatcher('profile')).as('getProfile');
  cy.intercept('GET', apiMatcher('account/settings')).as('getAccountSettings');
  cy.intercept('GET', apiMatcher('profile/preferences')).as(
    'getProfilePreferences'
  );
  cy.intercept('GET', apiMatcher('account/notifications**')).as(
    'getNotifications'
  );

  if (withLogin) {
    cy.visitWithLogin(path);
  } else {
    cy.visit(path);
  }
  cy.wait([
    '@getAccount',
    '@getAccountSettings',
    '@getProfilePreferences',
    '@getProfile',
    '@getNotifications',
  ]);
};

// use this if the call happens multiple times but you only want to intercept it once
export const interceptOnce = (
  method: HttpMethod,
  url: StringMatcher,
  response: {}
) => {
  let count = 0;
  return cy.intercept(method, url, (req) => {
    count += 1;
    if (count < 2) {
      req.reply(response);
    }
  });
};
