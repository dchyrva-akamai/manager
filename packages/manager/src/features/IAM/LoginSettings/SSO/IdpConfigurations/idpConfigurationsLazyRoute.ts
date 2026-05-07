import { createLazyRoute } from '@tanstack/react-router';

import { IdpConfigurations } from './IdpConfigurations';

export const idpConfigurationsLazyRoute = createLazyRoute(
  '/iam/login-settings/sso/idp-configurations'
)({
  component: IdpConfigurations,
});
