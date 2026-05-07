import { createLazyRoute } from '@tanstack/react-router';

import { EnforcementSettings } from './EnforcementSettings';

export const enforcementSettingsLazyRoute = createLazyRoute(
  '/iam/login-settings/sso/enforcement-settings'
)({
  component: EnforcementSettings,
});
