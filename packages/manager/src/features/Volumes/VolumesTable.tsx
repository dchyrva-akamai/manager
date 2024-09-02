import * as React from 'react';

import { useIsBlockStorageEncryptionFeatureEnabled } from 'src/components/Encryption/utils';
import { GroupByTagToggle } from 'src/components/GroupByTagToggle';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { TableSortCell } from 'src/components/TableSortCell';

import {
  StyledTagHeader,
  StyledTagHeaderRow,
} from '../Linodes/LinodesLanding/DisplayLinodes.styles';
import { VolumeTableRow } from './VolumeTableRow';

import type { ResourcePage, Volume } from '@linode/api-v4';
import type { PaginationProps } from 'src/hooks/usePagination';

interface Props {
  drawerSetters: {
    setIsAttachDrawerOpen: (isOpen: boolean) => void;
    setIsCloneDrawerOpen: (isOpen: boolean) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    setIsDetachDialogOpen: (isOpen: boolean) => void;
    setIsDetailsDrawerOpen: (isOpen: boolean) => void;
    setIsEditDrawerOpen: (isOpen: boolean) => void;
    setIsResizeDrawerOpen: (isOpen: boolean) => void;
    setIsUpgradeDialogOpen: (isOpen: boolean) => void;
    setSelectedVolumeId: (id: number) => void;
  };
  handleOrderChange: any;
  order: 'asc' | 'desc';
  orderBy: string;
  pagination: PaginationProps;
  toggleGroupVolumes: () => boolean;
  volumes: ResourcePage<Volume> | undefined;
  volumesAreGrouped: boolean;
}

export function VolumesTable({
  drawerSetters,
  handleOrderChange,
  order,
  orderBy,
  pagination,
  toggleGroupVolumes,
  volumes,
  volumesAreGrouped,
}: Props) {
  const {
    isBlockStorageEncryptionFeatureEnabled,
  } = useIsBlockStorageEncryptionFeatureEnabled();

  const handleDetach = (volume: Volume) => {
    drawerSetters.setSelectedVolumeId(volume.id);
    drawerSetters.setIsDetachDialogOpen(true);
  };

  const handleDelete = (volume: Volume) => {
    drawerSetters.setSelectedVolumeId(volume.id);
    drawerSetters.setIsDeleteDialogOpen(true);
  };

  const handleDetails = (volume: Volume) => {
    drawerSetters.setSelectedVolumeId(volume.id);
    drawerSetters.setIsDetailsDrawerOpen(true);
  };

  const handleEdit = (volume: Volume) => {
    drawerSetters.setSelectedVolumeId(volume.id);
    drawerSetters.setIsEditDrawerOpen(true);
  };

  const handleResize = (volume: Volume) => {
    drawerSetters.setSelectedVolumeId(volume.id);
    drawerSetters.setIsResizeDrawerOpen(true);
  };

  const handleClone = (volume: Volume) => {
    drawerSetters.setSelectedVolumeId(volume.id);
    drawerSetters.setIsCloneDrawerOpen(true);
  };

  const handleAttach = (volume: Volume) => {
    drawerSetters.setSelectedVolumeId(volume.id);
    drawerSetters.setIsAttachDrawerOpen(true);
  };

  const handleUpgrade = (volume: Volume) => {
    drawerSetters.setSelectedVolumeId(volume.id);
    drawerSetters.setIsUpgradeDialogOpen(true);
  };

  const getVolumeTableRow = (volume: Volume) => {
    return (
      <VolumeTableRow
        handlers={{
          handleAttach: () => handleAttach(volume),
          handleClone: () => handleClone(volume),
          handleDelete: () => handleDelete(volume),
          handleDetach: () => handleDetach(volume),
          handleDetails: () => handleDetails(volume),
          handleEdit: () => handleEdit(volume),
          handleResize: () => handleResize(volume),
          handleUpgrade: () => handleUpgrade(volume),
        }}
        isBlockStorageEncryptionFeatureEnabled={
          isBlockStorageEncryptionFeatureEnabled
        }
        key={volume.id}
        volume={volume}
      />
    );
  };

  const getUngroupedVolumes = () => {
    return volumes?.data.map((volume) => getVolumeTableRow(volume));
  };

  const getGroupedVolumes = () => {
    const tags = Array.from(
      new Set(volumes?.data.flatMap((volume) => volume.tags))
    );

    return tags?.map((tag, index) => (
      <React.Fragment key={index}>
        {getTagHeaderRow(tag)}

        {volumes?.data
          .filter((volume) => volume.tags.includes(tag))
          .map((volume) => getVolumeTableRow(volume))}
      </React.Fragment>
    ));
  };

  const getTagHeaderRow = (tag: string) => {
    return (
      <StyledTagHeaderRow data-qa-tag-header={tag}>
        <TableCell colSpan={7}>
          <StyledTagHeader variant="h2">{tag}</StyledTagHeader>
        </TableCell>
      </StyledTagHeaderRow>
    );
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableSortCell
              active={orderBy === 'label'}
              direction={order}
              handleClick={handleOrderChange}
              label="label"
            >
              Label
            </TableSortCell>
            <TableSortCell
              active={orderBy === 'status'}
              direction={order}
              handleClick={handleOrderChange}
              label="status"
            >
              Status
            </TableSortCell>
            <TableCell>Region</TableCell>
            <TableSortCell
              active={orderBy === 'size'}
              direction={order}
              handleClick={handleOrderChange}
              label="size"
            >
              Size
            </TableSortCell>
            <TableCell>Attached To</TableCell>
            {isBlockStorageEncryptionFeatureEnabled && (
              <TableCell>Encryption</TableCell>
            )}
            <TableCell sx={{ padding: '0 !important' }}>
              <GroupByTagToggle
                isGroupedByTag={volumesAreGrouped}
                toggleGroupByTag={toggleGroupVolumes}
              />
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {volumes?.data.length === 0 && (
            <TableRowEmpty colSpan={6} message="No volume found" />
          )}

          {volumesAreGrouped ? getGroupedVolumes() : getUngroupedVolumes()}
        </TableBody>
      </Table>

      <PaginationFooter
        count={volumes?.results ?? 0}
        eventCategory="Volumes Table"
        handlePageChange={pagination.handlePageChange}
        handleSizeChange={pagination.handlePageSizeChange}
        page={pagination.page}
        pageSize={pagination.pageSize}
      />
    </>
  );
}
