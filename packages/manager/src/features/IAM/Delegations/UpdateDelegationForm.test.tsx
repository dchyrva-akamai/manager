import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

import { mockMatchMedia, renderWithTheme } from 'src/utilities/testHelpers';

import { UpdateDelegationForm } from './UpdateDelegationForm';

import type { ChildAccountWithDelegates, User } from '@linode/api-v4';

beforeAll(() => mockMatchMedia());

const mocks = vi.hoisted(() => ({
  useAccountUsers: vi.fn(),
  useAllAccountUsersQuery: vi.fn(),
  usePermissions: vi.fn(),
  mockUseUpdateChildAccountDelegatesQuery: vi.fn(),
  mockMutateAsync: vi.fn(),
}));

vi.mock('@linode/queries', async () => {
  const actual = await vi.importActual('@linode/queries');
  return {
    ...actual,
    useAccountUsers: mocks.useAccountUsers,
    useAllAccountUsersQuery: mocks.useAllAccountUsersQuery,
    useUpdateChildAccountDelegatesQuery:
      mocks.mockUseUpdateChildAccountDelegatesQuery,
  };
});

vi.mock('src/features/IAM/hooks/usePermissions', async () => ({
  usePermissions: mocks.usePermissions,
}));

const mockUsers: User[] = [
  {
    email: 'user1@example.com',
    last_login: null,
    password_created: null,
    restricted: false,
    ssh_keys: [],
    tfa_enabled: false,
    user_type: 'default',
    username: 'user1',
    verified_phone_number: null,
  },
  {
    email: 'user2@example.com',
    last_login: null,
    password_created: null,
    restricted: false,
    ssh_keys: [],
    tfa_enabled: false,
    user_type: 'default',
    username: 'user2',
    verified_phone_number: null,
  },
];

const mockChildAccountWithDelegates: ChildAccountWithDelegates = {
  company: 'Test Company',
  euuid: 'E1234567-89AB-CDEF-0123-456789ABCDEF',
  users: ['user1'],
};

const defaultProps = {
  delegation: mockChildAccountWithDelegates,
  formattedCurrentUsers: [
    { label: mockUsers[0].username, value: mockUsers[0].username },
  ],
  onClose: vi.fn(),
};

describe('UpdateDelegationsDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useAccountUsers.mockReturnValue({
      data: { data: mockUsers, results: mockUsers.length },
      error: undefined,
      isFetching: false,
    });

    mocks.useAllAccountUsersQuery.mockReturnValue({
      isFetching: false,
      refetch: vi.fn().mockResolvedValue({ data: mockUsers }),
    });

    mocks.usePermissions.mockReturnValue({
      data: { update_delegate_users: true },
    });

    mocks.mockUseUpdateChildAccountDelegatesQuery.mockReturnValue({
      mutateAsync: mocks.mockMutateAsync,
    });

    mocks.mockMutateAsync.mockResolvedValue({});
  });

  it('renders the drawer with current delegates', () => {
    renderWithTheme(<UpdateDelegationForm {...defaultProps} />);

    expect(screen.getByText(/test company/i)).toBeInTheDocument();
    // user1 is returned by the mocked API and appears as a table row
    expect(screen.getByText('user1')).toBeInTheDocument();
  });

  it('allows adding a new delegate', async () => {
    renderWithTheme(<UpdateDelegationForm {...defaultProps} />);

    const user = userEvent.setup();

    // user2 is in the table (from API), click its row to select it
    await user.click(screen.getByText('user2'));

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mocks.mockMutateAsync).toHaveBeenCalledWith({
        euuid: mockChildAccountWithDelegates.euuid,
        users: ['user1', 'user2'],
      });
    });
  });

  it('allows sending an empty payload', async () => {
    renderWithTheme(<UpdateDelegationForm {...defaultProps} />);

    const user = userEvent.setup();

    // user1 is pre-selected; click its row to deselect it
    await user.click(screen.getByText('user1'));

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mocks.mockMutateAsync).toHaveBeenCalledWith({
        euuid: mockChildAccountWithDelegates.euuid,
        users: [],
      });
    });
  });
});
