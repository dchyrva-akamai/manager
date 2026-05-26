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
import { useTheme } from '@mui/material/styles';
import * as React from 'react';

import { DateTimeDisplay } from 'src/components/DateTimeDisplay';
import { useOrderV2 } from 'src/hooks/useOrderV2';

import { StatusIcon } from '../../../Shared/StatusIcon/StatusIcon';
import { idpConfiguration } from '../../constants';
import styles from './IdpConfigurationDrawer.module.css';
import {
  getCertificateStatus,
  truncateCertificate,
} from './idpConfigurationDrawer.utils';

import type { IdpCertificate } from '@linode/api-v4';

type OrderByKey = 'certificate' | 'not_after';

interface Props {
  certificates: IdpCertificate[];
  deletedIds: Set<string>;
  onToggleDelete: (id: string) => void;
}

export const CertificatesTable = ({
  certificates,
  deletedIds,
  onToggleDelete,
}: Props) => {
  const theme = useTheme();
  const preferenceKey = 'iam-idp-certificates-order';
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

  const handleSort = (column: OrderByKey) => {
    order.handleOrderChange(
      column,
      order.order === 'asc' && order.orderBy === column ? 'desc' : 'asc'
    );
  };

  const sortedCertificates = order.sortedData ?? certificates;

  const allDeleted =
    certificates.length > 0 &&
    certificates.every((cert) => deletedIds.has(cert.id));

  return (
    <>
      <h3 className={styles.sectionHeading}>SAML Certificates</h3>
      <Table
        aria-label="SAML Certificates"
        className={allDeleted ? styles.tableError : undefined}
      >
        <TableHead>
          <TableRow
            headerbackground={
              theme.tokens.component.Table.HeaderNested.Background
            }
            headerborder
          >
            <TableHeaderCell
              className={styles.certHeaderCell}
              onSort={() => handleSort('certificate')}
              sortable
              sorted={order.orderBy === 'certificate' ? order.order : undefined}
            >
              Certificate
            </TableHeaderCell>
            <TableHeaderCell
              className={styles.expirationHeaderCell}
              onSort={() => handleSort('not_after')}
              sortable
              sorted={order.orderBy === 'not_after' ? order.order : undefined}
            >
              Expiration Date
            </TableHeaderCell>
            <TableHeaderCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCertificates.map((cert, index) => {
            const isDeleted = deletedIds.has(cert.id);
            const status = getCertificateStatus(cert.not_after);
            const isLastRow = index === sortedCertificates.length - 1;

            return (
              <TableRow
                className={isDeleted ? styles.deletedRow : undefined}
                hoverable
                key={cert.id}
                rowborder={!(allDeleted && isLastRow)}
              >
                <TableCell
                  className={`${styles.certCell} ${isDeleted ? styles.deletedCell : ''}`}
                >
                  {truncateCertificate(cert.certificate)}
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
                    onClick={() => onToggleDelete(cert.id)}
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
