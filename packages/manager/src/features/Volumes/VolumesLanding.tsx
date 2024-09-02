import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { CircleProgress } from 'src/components/CircleProgress';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { PreferenceToggle } from 'src/components/PreferenceToggle/PreferenceToggle';
import { useOrder } from 'src/hooks/useOrder';
import { usePagination } from 'src/hooks/usePagination';
import { useVolumesQuery } from 'src/queries/volumes/volumes';
import { sendGroupByTagEnabledEvent } from 'src/utilities/analytics/customEventAnalytics';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

import { AttachVolumeDrawer } from './AttachVolumeDrawer';
import { CloneVolumeDrawer } from './CloneVolumeDrawer';
import { DeleteVolumeDialog } from './DeleteVolumeDialog';
import { DetachVolumeDialog } from './DetachVolumeDialog';
import { EditVolumeDrawer } from './EditVolumeDrawer';
import { ResizeVolumeDrawer } from './ResizeVolumeDrawer';
import { UpgradeVolumeDialog } from './UpgradeVolumeDialog';
import { VolumeDetailsDrawer } from './VolumeDetailsDrawer';
import { VolumesHeader } from './VolumesHeader';
import { VolumesLandingEmptyState } from './VolumesLandingEmptyState';
import { VolumesTable } from './VolumesTable';

import type { Filter, Volume } from '@linode/api-v4';
import type { PreferenceToggleProps } from 'src/components/PreferenceToggle/PreferenceToggle';

const preferenceKey = 'volumes';
const searchQueryKey = 'query';

export const VolumesLanding = () => {
  const location = useLocation<{ volume: Volume | undefined }>();
  const pagination = usePagination(1, preferenceKey);

  const queryParams = new URLSearchParams(location.search);
  const volumeLabelFromParam = queryParams.get(searchQueryKey) ?? '';

  const { handleOrderChange, order, orderBy } = useOrder(
    {
      order: 'desc',
      orderBy: 'label',
    },
    `${preferenceKey}-order`
  );

  const filter: Filter = {
    ['+order']: order,
    ['+order_by']: orderBy,
    ...(volumeLabelFromParam && {
      label: { '+contains': volumeLabelFromParam },
    }),
  };

  const { data: volumes, error, isFetching, isLoading } = useVolumesQuery(
    {
      page: pagination.page,
      page_size: pagination.pageSize,
    },
    filter
  );

  const [selectedVolumeId, setSelectedVolumeId] = React.useState<number>();
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = React.useState(
    Boolean(location.state?.volume)
  );
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isResizeDrawerOpen, setIsResizeDrawerOpen] = React.useState(false);
  const [isCloneDrawerOpen, setIsCloneDrawerOpen] = React.useState(false);
  const [isAttachDrawerOpen, setIsAttachDrawerOpen] = React.useState(false);
  const [isDetachDialogOpen, setIsDetachDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = React.useState(false);

  const selectedVolume = volumes?.data.find((v) => v.id === selectedVolumeId);

  if (isLoading) {
    return <CircleProgress />;
  }

  if (error) {
    return (
      <ErrorState
        errorText={
          getAPIErrorOrDefault(error, 'Error loading your volumes.')[0].reason
        }
      />
    );
  }

  if (volumes?.results === 0 && !volumeLabelFromParam) {
    return <VolumesLandingEmptyState />;
  }

  return (
    <>
      <VolumesHeader
        isFetching={isFetching}
        searchQueryKey={searchQueryKey}
        volumeLabelFromParam={volumeLabelFromParam}
      />

      <PreferenceToggle<boolean>
        preferenceKey="volumes_group_by_tag"
        preferenceOptions={[false, true]}
        toggleCallbackFn={sendGroupByAnalytic}
      >
        {({
          preference: volumesAreGrouped,
          togglePreference: toggleGroupVolumes,
        }: PreferenceToggleProps<boolean>) => {
          return (
            <VolumesTable
              drawerSetters={{
                setIsAttachDrawerOpen,
                setIsCloneDrawerOpen,
                setIsDeleteDialogOpen,
                setIsDetachDialogOpen,
                setIsDetailsDrawerOpen,
                setIsEditDrawerOpen,
                setIsResizeDrawerOpen,
                setIsUpgradeDialogOpen,
                setSelectedVolumeId,
              }}
              handleOrderChange={handleOrderChange}
              order={order}
              orderBy={orderBy}
              pagination={pagination}
              toggleGroupVolumes={toggleGroupVolumes}
              volumes={volumes}
              volumesAreGrouped={volumesAreGrouped}
            />
          );
        }}
      </PreferenceToggle>

      <AttachVolumeDrawer
        onClose={() => setIsAttachDrawerOpen(false)}
        open={isAttachDrawerOpen}
        volume={selectedVolume}
      />
      <VolumeDetailsDrawer
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          if (location.state?.volume) {
            window.history.replaceState(null, '');
          }
        }}
        open={isDetailsDrawerOpen}
        volume={selectedVolume ?? location.state?.volume}
      />
      <EditVolumeDrawer
        onClose={() => setIsEditDrawerOpen(false)}
        open={isEditDrawerOpen}
        volume={selectedVolume}
      />
      <ResizeVolumeDrawer
        onClose={() => setIsResizeDrawerOpen(false)}
        open={isResizeDrawerOpen}
        volume={selectedVolume}
      />
      <CloneVolumeDrawer
        onClose={() => setIsCloneDrawerOpen(false)}
        open={isCloneDrawerOpen}
        volume={selectedVolume}
      />
      <DetachVolumeDialog
        onClose={() => setIsDetachDialogOpen(false)}
        open={isDetachDialogOpen}
        volume={selectedVolume}
      />
      <UpgradeVolumeDialog
        onClose={() => setIsUpgradeDialogOpen(false)}
        open={isUpgradeDialogOpen}
        volume={selectedVolume}
      />
      <DeleteVolumeDialog
        onClose={() => setIsDeleteDialogOpen(false)}
        open={isDeleteDialogOpen}
        volume={selectedVolume}
      />
    </>
  );
};

const sendGroupByAnalytic = (value: boolean) => {
  sendGroupByTagEnabledEvent('volumes landing', value);
};

export default VolumesLanding;
