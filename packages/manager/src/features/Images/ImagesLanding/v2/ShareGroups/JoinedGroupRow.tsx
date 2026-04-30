import { TableCell, TableRow } from '@akamai/cds-components/react/Table';
import { formatDate } from '@akamai/compute-ui-core/datetime';
import { usePreferences, useProfile } from '@linode/queries';
import { Hidden, LinkButton, Tooltip } from '@linode/ui';
import { capitalize, truncateEnd } from '@linode/utilities';
import React from 'react';

import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { SHARE_GROUPS_JOINED_TAB_PENDO_IDS } from 'src/features/Images/constants';
import { getIsTableStripingEnabled } from 'src/features/Profile/Settings/TableStriping.utils';

import type { SharegroupToken } from '@linode/api-v4';
import type { Status } from 'src/components/StatusIcon/StatusIcon';

interface Props {
  joinedGroup: SharegroupToken;
}

const statusIconMap: Record<SharegroupToken['status'], Status> = {
  active: 'active',
  expired: 'inactive',
  pending: 'other',
  revoked: 'inactive',
};

export const JoinedGroupRow = (props: Props) => {
  const { joinedGroup } = props;
  const { data: profile } = useProfile();

  const { sharegroup_label, status, token_uuid, updated } = joinedGroup;

  const { data: tableStripingPreference } = usePreferences(
    (preferences) => preferences?.isTableStripingEnabled
  );

  const isTableStripingEnabled = getIsTableStripingEnabled(
    tableStripingPreference
  );

  return (
    <TableRow
      data-qa-joinedgroup-row={token_uuid}
      key={token_uuid}
      rowborder={!isTableStripingEnabled}
      style={{ padding: 0 }}
      zebra={isTableStripingEnabled}
    >
      <Tooltip
        title={
          sharegroup_label && sharegroup_label.length > 32
            ? sharegroup_label
            : ''
        }
      >
        <TableCell
          className="group-column"
          data-pendo-id={SHARE_GROUPS_JOINED_TAB_PENDO_IDS.joinedGroupName}
        >
          {sharegroup_label ? (
            <LinkButton
              onClick={() => {}}
              sx={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                display: 'block',
              }}
            >
              {truncateEnd(sharegroup_label, 32)}
            </LinkButton>
          ) : (
            '–'
          )}
        </TableCell>
      </Tooltip>
      <TableCell className="membership-status-column">
        <StatusIcon pulse={false} status={statusIconMap[status]} />
        {capitalize(status)}
      </TableCell>
      <Hidden mdDown>
        <TableCell className="status-changed-column">
          {updated !== null
            ? formatDate(updated, { timezone: profile?.timezone })
            : '–'}
        </TableCell>
      </Hidden>
      <TableCell style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!['expired', 'revoked'].includes(status) && (
          <LinkButton
            data-pendo-id={SHARE_GROUPS_JOINED_TAB_PENDO_IDS.leaveGroupButton}
            onClick={() => {}}
            sx={{
              whiteSpace: 'nowrap',
            }}
          >
            Leave Group
          </LinkButton>
        )}
      </TableCell>
    </TableRow>
  );
};
