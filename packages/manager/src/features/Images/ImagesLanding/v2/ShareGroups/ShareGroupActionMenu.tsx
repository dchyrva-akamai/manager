import React from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';

import type { Sharegroup } from '@linode/api-v4';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

export interface Handlers {
  onDelete?: (shareGroup: Sharegroup) => void;
}

interface Props {
  deleteButtonDisabled: boolean;
  handlers?: Handlers;
  shareGroup: Sharegroup;
}

export const ShareGroupActionMenu = (props: Props) => {
  const { deleteButtonDisabled, handlers, shareGroup } = props;
  const { onDelete } = handlers ?? {};

  const actions: Action[] = [
    {
      title: 'Edit Group Details',
      onClick: () => {},
      disabled: false,
      hidden: false,
      pendoId: 'Images Groups Owned-Edit Group Details',
    },
    {
      title: 'Add Images',
      onClick: () => {},
      disabled: false,
      hidden: false,
      pendoId: 'Images Groups Owned-Add Images',
    },
    {
      title: 'Add Members',
      onClick: () => {},
      disabled: false,
      hidden: false,
      pendoId: 'Images Groups Owned-Add Members',
    },
    {
      title: 'Delete',
      onClick: () => onDelete?.(shareGroup),
      disabled: deleteButtonDisabled,
      hidden: false,
      tooltip: deleteButtonDisabled
        ? 'Before deleting this share group, revoke access for all members first.'
        : undefined,
      pendoId: 'Images Groups Owned-Delete',
    },
  ];

  return (
    <ActionMenu
      actionsList={actions}
      ariaLabel="Action menu for share group"
      data-pendo-id="Images Groups Owned-Group Action menu"
    />
  );
};
