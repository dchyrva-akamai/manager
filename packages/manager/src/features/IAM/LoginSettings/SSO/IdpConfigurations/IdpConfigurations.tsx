import { Button, Icon } from '@akamai/cds-components/react';
import * as React from 'react';

import { usePermissions } from 'src/features/IAM/hooks/usePermissions';
import { CopyTooltip } from 'src/features/IAM/Shared/CopyTooltip/CopyTooltip';
import { Paper } from 'src/features/IAM/Shared/Paper/Paper';

import { METADATA_HREF } from '../../constants';
import { CertificatesTable } from './CertificatesTable';
import { IdpConfigurationDrawer } from './IdpConfigurationDrawer';
import { identityElementOptions } from './idpConfigurationDrawer.utils';
import styles from './IdpConfigurations.module.css';

import type { IdpConfig } from '@linode/api-v4';

export const IdpConfigurations = ({ idpConfig }: { idpConfig: IdpConfig }) => {
  // TODO - UIE-11305 replace with actual permissions check for creating IDP configurations
  const { data: permissions } = usePermissions('account', ['is_account_admin']);
  // TODO - UIE-11489 implement delete IDP configuration functionality
  // const { mutateAsync: deleteIdpConfig } = useDeleteIdpConfigMutation();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      // TODO - UIE-11489 implement delete IDP configuration functionality
      // await deleteIdpConfig({ euuid: idpConfig.id });
      // eslint-disable-next-line sonarjs/no-ignored-exceptions
    } catch (error) {
      // TODO: handle error
    }
  };

  const identityElementLabel =
    identityElementOptions.find(
      (opt) => opt.value === idpConfig.saml.identity_element
    )?.label ?? idpConfig.saml.identity_element;
  return (
    <>
      <Paper>
        <div className={styles.header}>
          <h3>Provider details</h3>
          <div className={styles.headerActions}>
            <Button onClick={handleDelete} type="button" variant="link">
              Delete IDP Configuration
            </Button>
            <Button
              disabled={!permissions?.is_account_admin}
              onClick={() => setIsEditDrawerOpen(true)}
              type="button"
              variant="primary"
            >
              Edit IDP Configuration
            </Button>
          </div>
        </div>
        <div className={styles.detailRow}>
          <p className={styles.detailLabel}>Label:</p>
          <p className={styles.detailValue}>{idpConfig.label}</p>
        </div>

        <div className={styles.detailRow}>
          <p className={styles.detailLabel}>Entity ID:</p>
          <p className={styles.detailValue}>{idpConfig.saml.entity_id}</p>
          <CopyTooltip text={idpConfig.saml.entity_id} />
        </div>

        <div className={styles.detailRow}>
          <p className={styles.detailLabel}>IDP URL:</p>
          <p className={styles.detailValue}>{idpConfig.saml.idp_url}</p>
          <CopyTooltip text={idpConfig.saml.idp_url} />
        </div>

        <div className={styles.metadataLink}>
          <Button
            onClick={() => {
              window.open(METADATA_HREF, '_blank', 'noopener,noreferrer');
            }}
            size="small"
            type="button"
            variant="link"
          >
            Show SP Metadata <Icon icon="external-link" size="xs" />
          </Button>
        </div>

        <h3 className={styles.sectionHeading}>Attribute Mapping</h3>

        <div className={styles.detailRow}>
          <p className={styles.detailLabel}>Identity Element:</p>
          <p className={styles.detailValue}>{identityElementLabel}</p>
        </div>

        {idpConfig.saml.identity_element === 'user_id_attribute' &&
          idpConfig.saml.user_id_attribute && (
            <div className={styles.detailRow}>
              <p className={styles.detailLabel}>Attribute Name:</p>
              <p className={styles.detailValue}>
                {idpConfig.saml.user_id_attribute}
              </p>
            </div>
          )}

        <div className={styles.certsHeader}>
          <h3>SAML Certificates</h3>
          <Button type="button" variant="secondary">
            Add Certificate
          </Button>
        </div>
        <CertificatesTable
          certificates={idpConfig.saml.public_certificates}
          idpConfigId={idpConfig.id}
          mode="landing"
        />
      </Paper>
      <IdpConfigurationDrawer
        idpConfig={idpConfig}
        mode="edit"
        onClose={() => setIsEditDrawerOpen(false)}
        open={isEditDrawerOpen}
      />
    </>
  );
};
