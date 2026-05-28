import { Button, TableCell, TableRow } from '@akamai/cds-components/react';
import { truncateMiddle } from '@akamai/compute-ui-core/formatting';
import React from 'react';

import { CopyTooltip } from 'src/features/IAM/Shared/CopyTooltip/CopyTooltip';
import { DateTimeDisplay } from 'src/features/IAM/Shared/DateTimeDisplay';
import { StatusIcon } from 'src/features/IAM/Shared/StatusIcon/StatusIcon';

import styles from './CertificatesTable.module.css';

import type { IdpCertificate } from '@linode/api-v4';
import type { Status } from 'src/features/IAM/Shared/StatusIcon/StatusIcon';

interface CertificateTableLandingProps {
  cert: IdpCertificate;
  isMobileScreen: boolean;
  isSmallScreen: boolean;
  status: Status;
}

const CertificateTableLanding = ({
  cert,
  isSmallScreen,
  isMobileScreen,
  status,
}: CertificateTableLandingProps) => {
  return (
    <TableRow hoverable key={cert.id} rowborder>
      <TableCell className={styles.certCellLanding}>
        {truncateMiddle(cert.certificate, isSmallScreen ? 24 : 46)}
        <CopyTooltip text={cert.certificate} />
      </TableCell>
      {!isMobileScreen && (
        <TableCell className={styles.expirationCell} hidden={isSmallScreen}>
          <StatusIcon pulse={false} status={status} />
          <DateTimeDisplay displayTime={false} value={cert.not_after} />
        </TableCell>
      )}

      <TableCell className={styles.actionCell}>
        <Button
          onClick={() => {}}
          style={{
            paddingRight: 'var(--global-spacing-s8, 8px)',
          }}
          type="button"
          variant="link"
        >
          View Details
        </Button>

        <Button
          onClick={() => {}}
          style={{
            paddingLeft: 'var(--global-spacing-s8, 8px)',
          }}
          type="button"
          variant="link"
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CertificateTableLanding;
