import { Button } from '@akamai/cds-components/react';
import { formatDate } from '@akamai/compute-ui-core/datetime';
import { capitalize } from '@akamai/compute-ui-core/formatting';
import {
  usePreferences,
  useProfile,
  useShareGroupFromTokenQuery,
  useShareGroupTokenQuery,
} from '@linode/queries';
import {
  Box,
  CircleProgress,
  ErrorState,
  Paper,
  Stack,
  Typography,
} from '@linode/ui';
import { Grid } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import * as React from 'react';

import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { LandingHeader } from 'src/components/LandingHeader';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { getIsTableStripingEnabled } from 'src/features/Profile/Settings/TableStriping.utils';

import { SHARE_GROUP_DETAILS_PENDO_IDS } from '../../constants';
import { StyledCopyIcon } from './JoinedGroupDetails.styles';
import { SharedImagesTable } from './SharedImagesTable';

import type { Sharegroup, SharegroupToken } from '@linode/api-v4';
import type { Status } from 'src/components/StatusIcon/StatusIcon';

const statusIconMap: Record<SharegroupToken['status'], Status> = {
  active: 'active',
  expired: 'inactive',
  pending: 'inactive',
  revoked: 'inactive',
};

export const JoinedGroupDetails = () => {
  const { data: profile } = useProfile();

  const { data: tableStripingPreference } = usePreferences(
    (preferences) => preferences?.isTableStripingEnabled
  );

  const isTableStripingEnabled = getIsTableStripingEnabled(
    tableStripingPreference
  );

  const { tokenUuid } = useParams({
    from: '/images/share-groups/joined-groups/$tokenUuid',
  });

  const {
    data: joinedGroup,
    error: joinedGroupError,
    isLoading,
  } = useShareGroupTokenQuery(tokenUuid);

  const { status, sharegroup_label, sharegroup_uuid, updated } = (joinedGroup ??
    {}) as SharegroupToken;

  // We are doing this in order to grab the share group description
  const {
    data: shareGroup,
    error: shareGroupError,
    isLoading: isShareGroupLoading,
  } = useShareGroupFromTokenQuery(tokenUuid);

  const { description } = (shareGroup ?? {}) as Sharegroup;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  if (isLoading || isShareGroupLoading) {
    return <CircleProgress />;
  }

  return (
    <>
      <DocumentTitleSegment segment={`${sharegroup_label} | Detail`} />
      <LandingHeader
        docsLabel="Docs"
        docsLink="https://techdocs.akamai.com/cloud-computing/docs/image-sharing"
        pendoId={SHARE_GROUP_DETAILS_PENDO_IDS.landingHeader}
        spacingBottom={4}
        title={sharegroup_label}
      />

      <Grid>
        {joinedGroupError && (
          <Paper sx={{ mb: 4, p: 2 }}>
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacingFunction(4),
                p: `${theme.spacingFunction(24)} ${theme.spacingFunction(32)}`,
              })}
            >
              <ErrorState errorText="There was an error loading your share group. Please try again." />
            </Box>
          </Paper>
        )}

        {!shareGroupError && shareGroup && (
          <>
            <Paper sx={{ mb: 4, p: 2 }}>
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                mb={2}
              >
                <Typography variant="h3">{sharegroup_label}</Typography>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Stack alignItems="center" direction="row">
                    <Button
                      data-pendo-id={
                        SHARE_GROUP_DETAILS_PENDO_IDS.deleteShareGroupButton
                      }
                      onClick={() => {
                        setIsDeleteDialogOpen(!isDeleteDialogOpen);
                      }}
                      style={{ marginRight: '4px' }}
                      variant="link"
                    >
                      Leave Group
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={16}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Stack direction="column">
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      Membership status
                    </Typography>
                    <Stack direction="row">
                      <Typography
                        sx={{ alignItems: 'center', display: 'flex' }}
                        variant="subtitle1"
                      >
                        <StatusIcon
                          pulse={false}
                          status={statusIconMap[status]}
                        />
                        {capitalize(status)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack alignContent="baseline" direction="column">
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      Status changed
                    </Typography>
                    <Typography
                      sx={{ whiteSpace: 'nowrap' }}
                      variant="subtitle1"
                    >
                      {formatDate(updated, { timezone: profile?.timezone })}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  justifyContent="end"
                  sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                >
                  <Stack alignContent="baseline" direction="column">
                    <Typography>Share group UUID</Typography>
                    <Stack alignContent="baseline" direction="row">
                      <Typography variant="subtitle1">
                        {sharegroup_uuid}
                      </Typography>
                      <StyledCopyIcon
                        data-pendo-id={
                          SHARE_GROUP_DETAILS_PENDO_IDS.copyShareGroupUUIDIcon
                        }
                        text={sharegroup_uuid ?? ''}
                      />
                    </Stack>
                  </Stack>
                  <Stack alignContent="baseline" direction="column">
                    {description && (
                      <Stack>
                        <Typography>Description</Typography>
                        <Typography variant="subtitle1">
                          {description}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
            <SharedImagesTable
              isTableStripingEnabled={isTableStripingEnabled}
              tokenUuid={tokenUuid}
            />
          </>
        )}
      </Grid>
    </>
  );
};
