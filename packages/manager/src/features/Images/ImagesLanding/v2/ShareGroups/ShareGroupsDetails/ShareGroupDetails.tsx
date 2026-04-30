import { Button } from '@akamai/cds-components/react';
import { usePreferences, useShareGroupQuery } from '@linode/queries';
import {
  Box,
  CircleProgress,
  ErrorState,
  Paper,
  Stack,
  TooltipIcon,
  Typography,
} from '@linode/ui';
import { Grid, styled } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import * as React from 'react';

import { CopyTooltip } from 'src/components/CopyTooltip/CopyTooltip';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { LandingHeader } from 'src/components/LandingHeader';
import { getIsTableStripingEnabled } from 'src/features/Profile/Settings/TableStriping.utils';

import { SHARE_GROUP_DETAILS_PENDO_IDS } from '../../constants';
import { GroupMembersTable } from './GroupMembersTable';
import { SharedImagesTable } from './SharedImagesTable';

export const ShareGroupDetails = () => {
  const { data: tableStripingPreference } = usePreferences(
    (preferences) => preferences?.isTableStripingEnabled
  );

  const isTableStripingEnabled = getIsTableStripingEnabled(
    tableStripingPreference
  );

  const { shareGroupId } = useParams({
    from: '/images/share-groups/owned-groups/$shareGroupId',
  });

  const {
    data: shareGroup,
    error: shareGroupError,
    isLoading,
  } = useShareGroupQuery(shareGroupId);
  const { label, description, uuid } = shareGroup ?? {};

  const [membersCount, setMembersCount] = React.useState(0);

  if (isLoading) {
    return <CircleProgress />;
  }

  return (
    <>
      <DocumentTitleSegment segment={`${label} | Detail`} />
      <LandingHeader
        docsLabel="Docs"
        docsLink="https://techdocs.akamai.com/cloud-computing/docs/image-sharing"
        pendoId={SHARE_GROUP_DETAILS_PENDO_IDS.landingHeader}
        spacingBottom={4}
        title={label}
      />

      <Grid>
        {shareGroupError && (
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
                <Typography variant="h3">{label}</Typography>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Button data-pendo-id={SHARE_GROUP_DETAILS_PENDO_IDS.editShareGroupButton} variant="link">Edit</Button>
                  <Stack alignItems="center" direction="row">
                    <Button
                      data-pendo-id={SHARE_GROUP_DETAILS_PENDO_IDS.deleteShareGroupButton}
                      disabled={membersCount > 0}
                      style={{ marginRight: '4px' }}
                      variant="link"
                    >
                      Delete
                    </Button>
                    {membersCount > 0 && (
                      <TooltipIcon
                        status="info"
                        sxTooltipIcon={{ margin: 0, padding: 0 }}
                        text="Before deleting this group, revoke access for all current members."
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>
              <Stack>
                <Typography>Share group UUID</Typography>
                <Stack alignContent="baseline" direction="row" spacing={1}>
                  <Typography variant="subtitle1">{uuid}</Typography>
                  <StyledCopyIcon data-pendo-id={SHARE_GROUP_DETAILS_PENDO_IDS.copyShareGroupuuidIcon } text={uuid ?? ''} />
                </Stack>
              </Stack>
              {description && (
                <Stack mt={2}>
                  <Typography>Description</Typography>
                  <Typography variant="subtitle1">{description}</Typography>
                </Stack>
              )}
            </Paper>
            <SharedImagesTable
              isTableStripingEnabled={isTableStripingEnabled}
              shareGroupId={shareGroupId}
            />
            <GroupMembersTable
              isTableStripingEnabled={isTableStripingEnabled}
              setMembersCount={setMembersCount}
              shareGroupId={shareGroupId}
            />
          </>
        )}
      </Grid>
    </>
  );
};

const StyledCopyIcon = styled(CopyTooltip)(() => ({
  padding: 0,
}));
