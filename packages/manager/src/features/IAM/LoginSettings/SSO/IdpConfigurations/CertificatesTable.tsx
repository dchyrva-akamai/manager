import { Button, FormError, Icon } from '@akamai/cds-components/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@akamai/cds-components/react/Table';
import { Spacing } from '@akamai/cds-tokens';
import { truncateMiddle } from '@akamai/compute-ui-core/formatting';
import * as React from 'react';

import { useBreakpoint } from 'src/features/Databases/hooks/useBreakpoint';
import { DateTimeDisplay } from 'src/features/IAM/Shared/DateTimeDisplay';
import { useOrderV2 } from 'src/hooks/useOrderV2';

import { StatusIcon } from '../../../Shared/StatusIcon/StatusIcon';
import { idpConfiguration } from '../../constants';
import styles from './CertificatesTable.module.css';
import CertificateTableLandingRow from './CertificateTableLandingRow';
import { getCertificateStatus } from './idpConfigurationDrawer.utils';
import idpConfigurationStyles from './IdpConfigurations.module.css';

import type { IdpCertificate } from '@linode/api-v4';

interface EditModeProps {
  certificates: IdpCertificate[];
  deletedIds: Set<string>;
  mode?: 'edit';
  onToggleDelete: (id: string) => void;
}

interface LandingModeProps {
  certificates: IdpCertificate[];
  idpConfigId: string;
  mode: 'landing';
}

type Props = EditModeProps | LandingModeProps;

export const CertificatesTable = (props: Props) => {
  const { certificates, mode } = props;
  const isLandingMode = mode === 'landing';

  const preferenceKey = isLandingMode
    ? 'iam-idp-certificates-landing-order'
    : 'iam-idp-certificates-edit-order';

  const order = useOrderV2<IdpCertificate>({
    data: certificates,
    initialRoute: {
      defaultOrder: {
        order: 'asc',
        orderBy: 'certificate',
      },
      from: '/iam/settings/sso/idp-configurations',
    },
    preferenceKey,
  });

  const sortedCertificates = order.sortedData ?? certificates;

  const allDeleted =
    !isLandingMode &&
    certificates.length > 0 &&
    certificates.every((cert) => props.deletedIds.has(cert.id));

  const handleSort = (orderBy: 'certificate' | 'not_after') => {
    order.handleOrderChange(
      orderBy,
      order.order === 'asc' && order.orderBy === orderBy ? 'desc' : 'asc'
    );
  };

  const isSmallScreen = useBreakpoint('down', 'lg');
  const isMobileScreen = useBreakpoint('down', 'sm');

  return (
    <>
      {!isLandingMode && (
        <h3 className={idpConfigurationStyles.sectionHeading}>
          SAML Certificates
        </h3>
      )}

      <Table
        aria-label="SAML Certificates"
        className={allDeleted ? styles.tableError : undefined}
      >
        <TableHead>
          <TableRow
            headerbackground={
              'var(--token-component-table-header-filled-background, light-dark(#e5e5ea, #515157))'
            }
            headerborder
          >
            <TableHeaderCell
              className={
                isLandingMode ? styles.certCellLanding : styles.certCell
              }
              onSort={() => handleSort('certificate')}
              sortable
              sorted={order.orderBy === 'certificate' ? order.order : undefined}
            >
              Certificate
            </TableHeaderCell>
            {!isMobileScreen && (
              <TableHeaderCell
                className={styles.expirationHeaderCell}
                hidden={isSmallScreen}
                onSort={() => handleSort('not_after')}
                sortable
                sorted={order.orderBy === 'not_after' ? order.order : undefined}
              >
                Expiration Date
              </TableHeaderCell>
            )}
            <TableHeaderCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedCertificates.map((cert, index) => {
            const status = getCertificateStatus(cert.not_after);
            const isLastRow = index === sortedCertificates.length - 1;

            if (isLandingMode) {
              return (
                <CertificateTableLandingRow
                  cert={cert}
                  isMobileScreen={isMobileScreen}
                  isSmallScreen={isSmallScreen}
                  key={cert.id}
                  status={status}
                />
              );
            }

            const isDeleted = props.deletedIds.has(cert.id);

            return (
              <TableRow
                hoverable
                key={cert.id}
                rowborder={!(allDeleted && isLastRow)}
              >
                <TableCell
                  className={`${styles.certCell} ${
                    isDeleted ? styles.deletedCell : ''
                  }`}
                >
                  {truncateMiddle(cert.certificate, 24)}
                </TableCell>

                <TableCell className={styles.expirationCell}>
                  <StatusIcon
                    className={isDeleted ? styles.deletedOpacity : undefined}
                    pulse={false}
                    status={status}
                    style={{ marginRight: Spacing.S0 }}
                  />

                  <DateTimeDisplay
                    className={isDeleted ? styles.deletedCell : undefined}
                    displayTime={false}
                    value={cert.not_after}
                  />
                </TableCell>

                <TableCell className={styles.actionCell}>
                  <Button
                    onClick={() => props.onToggleDelete(cert.id)}
                    style={{ lineHeight: 1 }}
                    type="button"
                    variant="link"
                  >
                    {isDeleted ? (
                      <>
                        <Icon icon="undo" size="xs" /> Undo
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {allDeleted && (
        <FormError className={styles.tableErrorMessage}>
          {idpConfiguration.allCertificatesDeletedError}
        </FormError>
      )}
    </>
  );
};
