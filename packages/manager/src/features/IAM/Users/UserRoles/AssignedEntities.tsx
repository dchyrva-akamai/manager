import { Button, Tooltip } from '@akamai/cds-components/react';
import { sortByString } from '@akamai/compute-ui-core/formatting';
import { Box, Chip, CloseIcon } from '@linode/ui';
import { useTheme } from '@mui/material';
import * as React from 'react';

import { SingleRowTruncatedList } from '../../Shared/SingleRowTruncatedList/SingleRowTruncatedList';

import type { CombinedEntity, ExtendedRoleView } from '../../Shared/types';
import type { AccountRoleType, EntityRoleType } from '@linode/api-v4';

interface Props {
  disabled?: boolean;
  onButtonClick: (roleName: AccountRoleType | EntityRoleType) => void;
  onRemoveAssignment: (entity: CombinedEntity, role: ExtendedRoleView) => void;
  role: ExtendedRoleView;
}

const MAX_ITEMS_TO_RENDER = 25;

export const AssignedEntities = ({
  onButtonClick,
  onRemoveAssignment,
  role,
  disabled,
}: Props) => {
  const theme = useTheme();

  const combinedEntities: CombinedEntity[] = React.useMemo(
    () =>
      role.entity_names!.map((name, index) => ({
        name,
        id: role.entity_ids![index],
      })),
    [role.entity_names, role.entity_ids]
  );

  const sortedEntities = React.useMemo(
    () =>
      [...combinedEntities].sort((a, b) => sortByString(a.name, b.name, 'asc')),
    [combinedEntities]
  );

  const entitiesToRender = React.useMemo(
    () => sortedEntities.slice(0, MAX_ITEMS_TO_RENDER),
    [sortedEntities]
  );

  const chipGapPx = Number.parseInt(theme.tokens.spacing.S8, 10) || 8;

  const overflowPillSx = {
    alignItems: 'center',
    backgroundColor:
      theme.name === 'light'
        ? theme.tokens.color.Ultramarine[20]
        : theme.tokens.color.Neutrals.Black,
    borderRadius: 1,
    display: 'inline-flex',
    height: '20px',
    padding: `0 ${theme.tokens.spacing.S8}`,
    position: 'relative' as const,
    top: 2,
  };

  const items = entitiesToRender.map((entity) => (
    <Tooltip
      disabled={entity.name.length <= 30}
      key={entity.id}
      tooltipPlacement="top"
      tooltipText={entity.name}
    >
      <Chip
        data-testid="entities"
        deleteIcon={
          disabled ? undefined : <CloseIcon data-testid="CloseIcon" />
        }
        label={
          entity.name.length > 30
            ? `${entity.name.slice(0, 20)}...`
            : entity.name
        }
        onDelete={disabled ? undefined : () => onRemoveAssignment(entity, role)}
        sx={{
          backgroundColor:
            theme.name === 'light'
              ? theme.tokens.color.Ultramarine[20]
              : theme.tokens.color.Neutrals.Black,
          color: theme.tokens.alias.Content.Text.Primary.Default,
          '& .MuiChip-deleteIcon': {
            color: theme.tokens.alias.Content.Text.Primary.Default,
          },
        }}
      />
    </Tooltip>
  ));

  // Phantom uses MAX_ITEMS_TO_RENDER digits to ensure the worst-case pill width is measured
  const phantomLabel = `+${MAX_ITEMS_TO_RENDER}`;

  return (
    <SingleRowTruncatedList
      gapPx={chipGapPx}
      items={items}
      overflowButtonPhantom={
        <Box sx={overflowPillSx}>
          <Button
            size="small"
            style={{
              color: theme.tokens.alias.Content.Text.Primary.Default,
              font: theme.tokens.alias.Typography.Label.Regular.Xs,
              padding: 0,
            }}
            variant="link"
          >
            {phantomLabel}
          </Button>
        </Box>
      }
      renderOverflowButton={(hiddenCount) => (
        <Box sx={overflowPillSx}>
          <Tooltip
            tooltipPlacement="top"
            tooltipText="Click to View All Entities"
          >
            <Button
              onClick={() => onButtonClick(role.name)}
              size="small"
              style={{
                color: theme.tokens.alias.Content.Text.Primary.Default,
                font: theme.tokens.alias.Typography.Label.Regular.Xs,
                padding: 0,
              }}
              variant="link"
            >
              +{hiddenCount}
            </Button>
          </Tooltip>
        </Box>
      )}
      totalCount={sortedEntities.length}
    />
  );
};
