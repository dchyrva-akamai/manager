import { screen } from '@testing-library/react';
import * as React from 'react';

import { SSO_EXCLUDED_USERS_DOCS_LINK } from 'src/features/IAM/Shared/constants';
import { renderWithThemeAndHookFormContext } from 'src/utilities/testHelpers';

import { ExcludedUsersPanel } from './ExcludedUsersPanel';

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

const renderComponent = (excludedUsers?: string[]) =>
  renderWithThemeAndHookFormContext<EnforcementSettingsFormValues>({
    component: <ExcludedUsersPanel excludedUsers={excludedUsers} />,
    useFormOptions: { defaultValues },
  });

describe('ExcludedUsersPanel', () => {
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
    expect(
      screen.getByRole('heading', { name: 'Excluded Users' })
    ).toBeVisible();
    expect(
      screen.getByText(/Excluded Users bypass the SSO enforcement/i)
    ).toBeVisible();
    expect(document.querySelector('cds-tag-input')).toBeInTheDocument();
  });

  it('renders the "Learn more" link with the correct href', () => {
    renderComponent();
    const link = screen.getByRole('link', { name: /learn more/i });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', SSO_EXCLUDED_USERS_DOCS_LINK);
  });
});
