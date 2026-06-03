import { screen } from '@testing-library/react';
import React from 'react';

import { accountRolesFactory } from 'src/factories/accountRoles';
import { userRolesFactory } from 'src/factories/userRoles';
import { mockMatchMedia, renderWithTheme } from 'src/utilities/testHelpers';

import { AssignedRolesTableBody } from './AssignedRolesTableBody';
import { combineRoles, mapRolesToPermissions } from './utils';

beforeAll(() => mockMatchMedia());

const defaultHandlers = {
  handleChangeRole: vi.fn(),
  handleRemoveAssignment: vi.fn(),
  handleUnassignRole: vi.fn(),
  handleUpdateEntities: vi.fn(),
  handleViewEntities: vi.fn(),
};

const defaultPermissions = {
  is_account_admin: true,
  update_default_delegate_access: true,
};

const buildRole = () => {
  const accountRoles = accountRolesFactory.build();
  const userRoles = combineRoles(userRolesFactory.build());
  return mapRolesToPermissions(accountRoles, userRoles)[0];
};

describe('AssignedRolesTableBody', () => {
  it('renders empty state', () => {
    renderWithTheme(
      <table>
        <tbody>
          <AssignedRolesTableBody
            paginatedData={[]}
            permissions={defaultPermissions}
            {...defaultHandlers}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('table-row-empty')).toBeInTheDocument();
    expect(screen.getByText('No items to display.')).toBeVisible();
  });

  it('renders expandable role row', () => {
    const role = buildRole();

    renderWithTheme(
      <table>
        <tbody>
          <AssignedRolesTableBody
            paginatedData={[role]}
            permissions={defaultPermissions}
            {...defaultHandlers}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText(role.name)).toBeVisible();
    expect(screen.getByText('Permissions')).toBeVisible();
  });
});
