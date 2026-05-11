import {
  Button,
  Icon,
  Tooltip,
  ZeroErrorActions,
  ZeroErrorDescription,
  ZeroErrorIcon,
  ZeroErrorState,
  ZeroErrorTitle,
} from '@akamai/cds-components/react';
import { useGetIdpConfigsQuery } from '@linode/queries';
import * as React from 'react';

import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { usePermissions } from 'src/features/IAM/hooks/usePermissions';
import { CircleProgress } from 'src/features/IAM/Shared/CircleProgress/CircleProgress';
import { ErrorState } from 'src/features/IAM/Shared/ErrorState/ErrorState';

import { IdpConfigurations } from './IdpConfigurations';

export const IdpConfigurationsLanding = () => {
  // TODO - UIE-11305 replace with actual permissions check for creating IDP configurations
  const { data: permissions, error: permissionsError } = usePermissions(
    'account',
    ['is_account_admin']
  );
  const { data, error, isLoading } = useGetIdpConfigsQuery();

  const hasIdpConfig = data && data.results > 0;

  if (isLoading) {
    return <CircleProgress />;
  }

  if (error || permissionsError) {
    return <ErrorState />;
  }

  return (
    <>
      <DocumentTitleSegment segment="IDP Configuration" />
      {hasIdpConfig ? (
        <IdpConfigurations />
      ) : (
        <ZeroErrorState>
          <ZeroErrorIcon icon="doc-no-selection" />
          <ZeroErrorTitle>No data to display</ZeroErrorTitle>
          <ZeroErrorDescription style={{ maxWidth: 260 }}>
            Once you create the IDP configuration, it will show up here.
          </ZeroErrorDescription>
          <ZeroErrorActions>
            <Tooltip
              disabled={permissions?.is_account_admin}
              tooltipPlacement="bottom"
              tooltipText="You do not have permission to create IDP configuration."
            >
              <Button
                disabled={!permissions?.is_account_admin}
                onClick={() => {}}
                variant="primary"
              >
                Create IDP Configuration
                {!permissions?.is_account_admin && (
                  <Icon icon="info-outline" size="m" />
                )}
              </Button>
            </Tooltip>
          </ZeroErrorActions>
        </ZeroErrorState>
      )}
    </>
  );
};
