import { Button, Checkbox, Pagination } from '@akamai/cds-components/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@akamai/cds-components/react/Table';
import { formatDate } from '@akamai/compute-ui-core/datetime';
import { useProfile, useShareGroupsMembersQuery } from '@linode/queries';
import { getAPIFilterFromQuery } from '@linode/search';
import {
  Box,
  ErrorState,
  Hidden,
  Paper,
  Stack,
  styled,
  Typography,
  useTheme,
  ZeroStateSearchNarrowIcon,
} from '@linode/ui';
import { capitalize } from '@linode/utilities';
import { useNavigate, useSearch } from '@tanstack/react-router';
import * as React from 'react';

import { CopyTooltip } from 'src/components/CopyTooltip/CopyTooltip';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField/DebouncedSearchTextField';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { useOrderV2 } from 'src/hooks/useOrderV2';
import { usePaginationV2 } from 'src/hooks/usePaginationV2';

import {
  DEFAULT_PAGE_SIZES,
  SHARE_GROUP_DETAILS_PENDO_IDS,
} from '../../constants';

interface Props {
  isTableStripingEnabled: boolean;
  setMembersCount?: (count: number) => void;
  shareGroupId: string;
}

const MEMBERS_COLUMNS = [
  { name: 'label', label: 'Member' },
  { name: 'token_uuid', label: 'Token UUID', hiddenLgDown: false },
  { name: 'status', label: 'Status', hiddenLgDown: false },
  { name: 'updated', label: 'Status Changed', hiddenLgDown: true },
];

export const GroupMembersTable = (props: Props) => {
  const { isTableStripingEnabled, shareGroupId, setMembersCount } = props;
  const theme = useTheme();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const [showInactiveMembers, setShowInactiveMembers] = React.useState(true);

  const search = useSearch({
    from: '/images/share-groups/owned-groups/$shareGroupId',
  });

  const { error: searchParseError, filter } = getAPIFilterFromQuery(
    search.membersQuery,
    {
      searchableFieldsWithoutOperator: ['label'],
    }
  );

  const pagination = usePaginationV2({
    currentRoute: '/images/share-groups/owned-groups/$shareGroupId',
    preferenceKey: 'shareGroupDetailsMembers',
    searchParams: (prev) => ({
      ...prev,
      membersQuery: search.membersQuery,
    }),
  });

  const {
    data: members,
    error,
    isFetching: membersIsFetching,
  } = useShareGroupsMembersQuery(
    shareGroupId,
    {
      page: pagination.page,
      page_size: pagination.pageSize,
    },
    { ...filter }
  );

  const { handleOrderChange, order, orderBy, sortedData } = useOrderV2({
    initialRoute: {
      defaultOrder: {
        order: 'asc',
        orderBy: 'label',
      },
      from: '/images/share-groups/owned-groups/$shareGroupId',
    },
    preferenceKey: 'shareGroupDetailsGroupMembers',
    prefix: 'members',
    data: members?.data ?? [],
  });

  React.useEffect(() => {
    setMembersCount?.(members?.data.length ?? 0);
  }, [members, setMembersCount]);

  const onSearch = (query: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        membersQuery: query || undefined,
      }),
      to: '/images/share-groups/owned-groups/$shareGroupId',
      params: { shareGroupId },
    });
  };

  const handlePageChange = (event: CustomEvent<{ page: number }>) => {
    pagination.handlePageChange(Number(event.detail));
  };

  const handlePageSizeChange = (event: CustomEvent<{ pageSize: number }>) => {
    const newSize = event.detail.pageSize;
    pagination.handlePageSizeChange(newSize);
  };

  const getMemberStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      default:
        return 'other';
    }
  };

  return (
    <Paper sx={{ mb: 4, p: 2 }}>
      <Typography mb={2} variant="h3">
        Group members
      </Typography>

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
        mb={4}
        spacing={2}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          <DebouncedSearchTextField
            clearable
            containerProps={{
              sx: {
                mb: 2,
                width: '300px',
              },
            }}
            debounceTime={250}
            errorText={searchParseError?.message}
            hideLabel
            isSearching={membersIsFetching}
            label="Search"
            onSearch={onSearch}
            pendoId={SHARE_GROUP_DETAILS_PENDO_IDS.groupMembersSearchField}
            placeholder="Search group members"
            value={search.query ?? ''}
          />
          <Checkbox
            checked={showInactiveMembers}
            data-pendo-id={
              SHARE_GROUP_DETAILS_PENDO_IDS.inactiveMembersCheckbox
            }
            name="inactive-members-checkbox"
            onChange={() => setShowInactiveMembers(!showInactiveMembers)}
          >
            Show inactive members
          </Checkbox>
        </Stack>
        <Button
          data-pendo-id={SHARE_GROUP_DETAILS_PENDO_IDS.addMembersButton}
          style={{ marginLeft: 0 }}
          variant="primary"
        >
          Add Members
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow
            headerbackground={
              theme.tokens.component.Table.HeaderNested.Background
            }
            headerborder
          >
            {MEMBERS_COLUMNS.map((column) => (
              <Hidden key={column.name} lgDown={column.hiddenLgDown}>
                <TableHeaderCell
                  onSort={() =>
                    handleOrderChange(
                      column.name,
                      order === 'asc' ? 'desc' : 'asc'
                    )
                  }
                  sortable
                  sorted={orderBy === column.name ? order : undefined}
                >
                  {column.label}
                </TableHeaderCell>
              </Hidden>
            ))}
            <TableHeaderCell style={{ maxWidth: '10%' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {error && search.membersQuery && (
            <TableRow rowborder>
              <TableCell style={{ padding: 0 }}>
                <ErrorState compact errorText={error[0].reason} />
              </TableCell>
            </TableRow>
          )}
          {!error && members?.data.length === 0 && (
            <TableRow rowborder>
              <TableCell
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                <Box
                  sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: theme.spacingFunction(4),
                    p: `${theme.spacingFunction(24)} ${theme.spacingFunction(32)}`,
                    width: '100%',
                  })}
                >
                  <ZeroStateSearchNarrowIcon />
                  <Typography variant="h3">No group members</Typography>
                  <Typography variant="body1">
                    Click 'Add Members' to share images with other users.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
          {sortedData
            ?.filter(
              (member) => showInactiveMembers || member.status === 'active'
            )
            .map((member) => (
              <TableRow
                key={member.token_uuid}
                rowborder={!isTableStripingEnabled}
                style={{ padding: 0 }}
                zebra={isTableStripingEnabled}
              >
                <TableCell>{member.label}</TableCell>
                <TableCell>
                  <Stack alignContent="baseline" direction="row">
                    <Typography>{member.token_uuid ?? '-'}</Typography>
                    <StyledCopyIcon
                      data-pendo-id={
                        SHARE_GROUP_DETAILS_PENDO_IDS.copyMembersuuidIcon
                      }
                      sx={{ padding: 0 }}
                      text={member.token_uuid ?? ''}
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <StatusIcon status={getMemberStatus(member.status)} />
                    <Typography>{capitalize(member.status)}</Typography>
                  </Box>
                </TableCell>
                <Hidden lgDown>
                  <TableCell>
                    {member.updated
                      ? formatDate(member.updated, {
                          timezone: profile?.timezone,
                        })
                      : '–'}
                  </TableCell>
                </Hidden>
                <TableCell style={{ maxWidth: '10%' }}>
                  <Button
                    data-pendo-id={
                      SHARE_GROUP_DETAILS_PENDO_IDS.revokeAccessButton
                    }
                    variant="link"
                  >
                    Revoke Access
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {members && members?.data.length > DEFAULT_PAGE_SIZES[0] && (
        <Pagination
          count={members?.data.length ?? 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          page={pagination.page}
          pageSize={pagination.pageSize}
          pageSizes={DEFAULT_PAGE_SIZES}
        />
      )}
    </Paper>
  );
};

const StyledCopyIcon = styled(CopyTooltip)(() => ({
  padding: 0,
}));
