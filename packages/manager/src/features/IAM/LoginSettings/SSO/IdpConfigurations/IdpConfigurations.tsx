import {
  Button,
  Icon,
  NotificationBanner,
  Tooltip,
} from '@akamai/cds-components/react';
import * as React from 'react';

import { usePermissions } from 'src/features/IAM/hooks/usePermissions';
import { CopyTooltip } from 'src/features/IAM/Shared/CopyTooltip/CopyTooltip';
import { Paper } from 'src/features/IAM/Shared/Paper/Paper';

import {
  ADD_CERTIFICATE_PERMISSION_ERROR,
  MAX_CERTIFICATES_REACHED_ERROR,
  METADATA_HREF,
  SSO_EXPIRED_ENFORCED,
  SSO_EXPIRING,
  SSO_REQUIRES_ACTIVE_CERTIFICATE,
} from '../../constants';
import { AddCertificateDrawer } from './AddCertificateDrawer';
import { CertificatesTable } from './CertificatesTable';
import { IDPConfigDeleteConfirmation } from './IDPConfigDeleteConfirmation';
import { IdpConfigurationDrawer } from './IdpConfigurationDrawer';
import {
  getCertificateStatus,
  identityElementOptions,
} from './idpConfigurationDrawer.utils';
import styles from './IdpConfigurations.module.css';

import type { IdpConfig } from '@linode/api-v4';

export const IdpConfigurations = ({ idpConfig }: { idpConfig: IdpConfig }) => {
  // TODO - UIE-11305 replace with actual permissions check for creating IDP configurations
  const { data: permissions } = usePermissions('account', ['is_account_admin']);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isAddCertDrawerOpen, setIsAddCertDrawerOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const identityElementLabel =
    identityElementOptions.find(
      (opt) => opt.value === idpConfig.saml.identity_element
    )?.label ?? idpConfig.saml.identity_element;

  const isMaxCertificatesReached =
    idpConfig.saml.public_certificates.length >= 10;
  const certs = idpConfig.saml.public_certificates;

  // Count certificates that are not expired (error). Both 'active' and
  // 'other' (expiring soon) are considered valid for deletion rules.
  const activeCertificatesCount = certs.filter(
    (certificate) =>
      getCertificateStatus(certificate.not_after).status !== 'error'
  ).length;

  // Count only currently-active certificates (not 'other' or 'error').
  // We use this to decide whether to show the banner — if there are no
  // actively-valid certificates (i.e., only 'other' or 'error'), we
  // should surface a banner. This ensures a single 'yellow' cert shows
  // the yellow warning banner.
  const activeOnlyCount = certs.filter(
    (certificate) =>
      getCertificateStatus(certificate.not_after).status === 'active'
  ).length;

  const expiredCount = certs.length - activeCertificatesCount;
  const expiringCount = activeCertificatesCount - activeOnlyCount;
  return (
    <>
      <Paper>
        <div className={styles.header}>
          <h3>Provider details</h3>
          <div className={styles.headerActions}>
            <Tooltip
              disabled={permissions?.is_account_admin}
              tooltipPlacement="bottom"
              tooltipText="You do not have permission to delete this IDP configuration."
            >
              <Button
                disabled={!permissions?.is_account_admin}
                onClick={() => setIsDeleteDialogOpen(true)}
                type="button"
                variant="link"
              >
                Delete IDP Configuration
                {!permissions?.is_account_admin ? (
                  <Icon icon="info-outline" size="m" />
                ) : null}
              </Button>
            </Tooltip>
            <Tooltip
              disabled={permissions?.is_account_admin}
              tooltipText="You do not have permission to edit this IDP configuration."
            >
              <Button
                disabled={!permissions?.is_account_admin}
                onClick={() => setIsEditDrawerOpen(true)}
                type="button"
                variant="primary"
              >
                Edit IDP Configuration
                {!permissions?.is_account_admin ? (
                  <Icon icon="info-outline" size="m" />
                ) : null}
              </Button>
            </Tooltip>
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
          <Tooltip
            disabled={
              !(isMaxCertificatesReached || !permissions?.is_account_admin)
            }
            tooltipPlacement="bottom"
            tooltipText={
              isMaxCertificatesReached
                ? MAX_CERTIFICATES_REACHED_ERROR
                : !permissions?.is_account_admin
                  ? ADD_CERTIFICATE_PERMISSION_ERROR
                  : undefined
            }
          >
            <Button
              disabled={
                isMaxCertificatesReached || !permissions?.is_account_admin
              }
              onClick={() => setIsAddCertDrawerOpen(true)}
              type="button"
              variant="secondary"
            >
              Add Certificate
              {(isMaxCertificatesReached || !permissions?.is_account_admin) && (
                <Icon icon="info-outline" size="s" />
              )}
            </Button>
          </Tooltip>
        </div>
        {idpConfig.enabled && activeOnlyCount === 0 && (
          <NotificationBanner
            style={{ marginBottom: 'var(--token-global-spacing-s16, 16px)' }}
            text={
              // Red only when all certs are expired
              expiredCount > 0 && expiredCount === certs.length
                ? SSO_EXPIRED_ENFORCED
                : // Yellow when there are expiring certs but no active
                  expiringCount > 0
                  ? SSO_EXPIRING
                  : SSO_REQUIRES_ACTIVE_CERTIFICATE
            }
            type={
              expiredCount > 0 && expiredCount === certs.length
                ? 'error'
                : 'warning'
            }
          />
        )}

        <CertificatesTable
          activeCertificateCount={activeCertificatesCount}
          certificates={idpConfig.saml.public_certificates}
          idpConfigId={idpConfig.id}
          mode="landing"
          ssoEnabled={idpConfig.enabled}
        />
      </Paper>
      <IdpConfigurationDrawer
        idpConfig={idpConfig}
        mode="edit"
        onClose={() => setIsEditDrawerOpen(false)}
        open={isEditDrawerOpen}
      />
      <AddCertificateDrawer
        idpConfigId={idpConfig.id}
        onClose={() => setIsAddCertDrawerOpen(false)}
        open={isAddCertDrawerOpen}
      />
      <IDPConfigDeleteConfirmation
        idpConfigId={idpConfig.id}
        idpConfigLabel={idpConfig.label}
        onClose={() => setIsDeleteDialogOpen(false)}
        open={isDeleteDialogOpen}
      />
    </>
  );
};
