import { Button } from '@akamai/cds-components/react';
import { Spacing, Typography } from '@akamai/cds-tokens';
import { Paper } from '@linode/ui';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { SSO_ENFORCEMENT_LINK } from '../Shared/constants';
import { StatusIcon } from '../Shared/StatusIcon/StatusIcon';

// TODO: Add a Link component + Paper component;
export const LoginSettingsLanding = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ padding: Spacing.S24 }}>
      <h2
        style={{
          marginTop: Spacing.S0,
          marginBottom: Spacing.S12,
          font: Typography.Heading.S,
        }}
      >
        Single Sign-On Enforcement
      </h2>
      <p style={{ margin: Spacing.S0 }}>
        The single sign-on (SSO) enforcement enables you to configure the SSO
        login for users of your account, including identity provider (IDP)
        configuration and excluded users.{' '}
        <a href={SSO_ENFORCEMENT_LINK}>Learn more.</a>
      </p>
      <div
        style={{
          padding: `${Spacing.S8} 0`,
          margin: `${Spacing.S16} 0`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <StatusIcon status="active" />
        <p style={{ margin: Spacing.S0 }}>
          Disabled. SSO login is not configured for this account.
        </p>
      </div>
      <Button
        onClick={() =>
          navigate({ to: '/iam/login-settings/sso/idp-configurations' })
        }
        variant="secondary"
      >
        Manage SSO Enforcement
      </Button>
    </Paper>
  );
};
