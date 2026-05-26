import { Button } from '@akamai/cds-components/react';
import * as React from 'react';

import { usePermissions } from 'src/features/IAM/hooks/usePermissions';

import { IdpConfigurationDrawer } from './IdpConfigurationDrawer';

import type { IdpConfig } from '@linode/api-v4';

interface Props {
  idpConfig: IdpConfig;
}

// TODO: Implement IDP Configurations tab
// - Provider details section (label, Entity ID, IDP URL, attribute mapping)
// - "Show SP Metadata" button → opens drawer
// - SAML Certificates table with Add / View Details / Delete actions
export const IdpConfigurations = ({ idpConfig }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // TODO - UIE-11305 replace with actual permissions check for creating IDP configurations
  const { data: permissions } = usePermissions('account', ['is_account_admin']);

  return (
    <div>
      <Button
        disabled={!permissions?.is_account_admin}
        onClick={() => setIsDrawerOpen(true)}
        variant="primary"
      >
        Edit IDP Configuration
      </Button>
      <IdpConfigurationDrawer
        idpConfig={idpConfig}
        mode="edit"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      />
    </div>
  );
};
