import { screen } from '@testing-library/react';
import * as React from 'react';

import { SSO_INCLUDED_USERS_DOCS_LINK } from 'src/features/IAM/Shared/constants';
import { renderWithThemeAndHookFormContext } from 'src/utilities/testHelpers';

import { IncludedUsersPanel } from './IncludedUsersPanel';

import type { EnforcementSettingsFormValues } from './EnforcementSettings';

const queryMocks = vi.hoisted(() => ({
  useAccountUsersInfiniteQuery: vi.fn().mockReturnValue({}),
  usePermissions: vi.fn().mockReturnValue({}),
}));

vi.mock('@linode/queries', async () => {
  const actual = await vi.importActual('@linode/queries');
  return {
    ...actual,
    useAccountUsersInfiniteQuery: queryMocks.useAccountUsersInfiniteQuery,
  };
});

vi.mock('src/features/IAM/hooks/usePermissions', async () => {
  const actual = await vi.importActual('src/features/IAM/hooks/usePermissions');
  return {
    ...actual,
    usePermissions: queryMocks.usePermissions,
  };
});

const defaultValues: EnforcementSettingsFormValues = {
  excludedUsers: [],
  includedUsers: [],
  isAcknowledged: false,
  ssoEnabled: false,
  ssoEnforced: false,
};

const renderComponent = (includedUsers?: string[]) =>
  renderWithThemeAndHookFormContext<EnforcementSettingsFormValues>({
    component: <IncludedUsersPanel includedUsers={includedUsers} />,
    useFormOptions: { defaultValues },
  });

describe('IncludedUsersPanel', () => {
  beforeEach(() => {
    queryMocks.usePermissions.mockReturnValue({
      data: { view_user: true },
    });
    queryMocks.useAccountUsersInfiniteQuery.mockReturnValue({
      data: {
        pages: [{ data: [{ username: 'user1' }, { username: 'user2' }] }],
      },
      error: null,
      isLoading: false,
    });
  });

  it('renders the section heading', () => {
    renderComponent();
    expect(screen.getByText('Included users')).toBeVisible();
    expect(
      screen.getByText(/Before enforcing SSO for all users/i)
    ).toBeVisible();
  });

  it('renders the "Learn more" link with the correct href', () => {
    renderComponent();
    const link = screen.getByRole('link', { name: /learn more/i });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', SSO_INCLUDED_USERS_DOCS_LINK);
  });

  it('renders the TagInput element', () => {
    renderComponent();
    expect(screen.getByText('Included Users')).toBeVisible();

    expect(document.querySelector('cds-tag-input')).toBeInTheDocument();
  });
});
