import {
  FormError,
  FormField,
  FormLabel,
  TagInput,
} from '@akamai/cds-components/react';
import { Spacing, Typography } from '@akamai/cds-tokens';
import { useAllAccountUsersQuery } from '@linode/queries';
import { getAPIFilterFromQuery } from '@linode/search';
import { useTheme } from '@linode/ui';
import { useDebouncedValue } from '@linode/utilities';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { usePermissions } from 'src/features/IAM/hooks/usePermissions';
import {
  ERROR_STATE_TITLE,
  SSO_EXCLUDED_USERS_DOCS_LINK,
} from 'src/features/IAM/Shared/constants';
import { Link } from 'src/features/IAM/Shared/Link/Link';

import type { EnforcementSettingsFormValues } from './EnforcementSettings';
import type { TagInputElement } from '@akamai/cds-components';
interface Props {
  excludedUsers: string[] | undefined;
}

export const ExcludedUsersPanel = ({ excludedUsers }: Props) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const { control } = useFormContext<EnforcementSettingsFormValues>();

  // TODO: UIE-11408 - replace after tag input supports passing in options directly
  // instead of using ref to set preselected options
  const tagInputRef = React.useCallback(
    (node: null | TagInputElement<string>) => {
      if (node && excludedUsers && excludedUsers.length > 0) {
        node.setValue(excludedUsers);
      }
    },
    [excludedUsers]
  );

  const { data: permissions } = usePermissions('account', ['view_user']);
  const [usernameInput, setUsernameInput] = React.useState<string>('');

  const debouncedUsernameInput = useDebouncedValue(usernameInput);

  const { error: searchError, filter } = getAPIFilterFromQuery(
    debouncedUsernameInput,
    {
      searchableFieldsWithoutOperator: ['username', 'email'],
    }
  );

  // TODO - UIE-11455: replace with useAccountUsersInfiniteQuery when tag input supports infinite loading
  const {
    data: users,
    error,
    isLoading,
  } = useAllAccountUsersQuery(permissions?.view_user, {
    ...filter,
    '+order': 'asc',
    '+order_by': 'username',
  });

  const userOptions = React.useMemo(() => {
    return users?.map((user) => user.username);
  }, [users]);

  return (
    <div>
      <h2
        style={{
          marginTop: Spacing.S0,
          marginBottom: Spacing.S12,
          font: Typography.Heading.S,
        }}
      >
        Excluded Users
      </h2>
      <p
        style={{
          marginTop: Spacing.S0,
          marginBottom: Spacing.S12,
        }}
      >
        Excluded Users bypass the SSO enforcement and continue to log in with a
        password. Add them to ensure emergency access to your account in case
        your Identity Provider is unavailable. To improve security, we strongly
        recommend configuring the two-factor authentication for these users.{' '}
        <Link to={SSO_EXCLUDED_USERS_DOCS_LINK}>Learn more.</Link>
      </p>
      <Controller
        control={control}
        name="excludedUsers"
        render={({ field, fieldState }) => (
          <FormField
            error={Boolean(fieldState.error?.message)}
            labelPosition="top"
            style={{ padding: Spacing.S0 }}
          >
            <FormLabel
              slot="label"
              style={{
                textAlign: 'left',
                padding: Spacing.S0,
                marginBottom: Spacing.S8,
              }}
            >
              Excluded Users
            </FormLabel>
            <TagInput
              filterFn={() => true}
              isError={Boolean(searchError || error)}
              isLoading={isLoading}
              items={userOptions ?? []}
              loadingErrorLabel={searchError?.message || ERROR_STATE_TITLE}
              onChange={(e) => field.onChange(e.detail)}
              onSearchChange={(e) => setUsernameInput(e.detail)}
              placeholder="Search by name or email or select from the list"
              ref={tagInputRef}
              restricted
              style={{
                width: isSmUp ? 598 : '100%',
                marginBottom: Spacing.S16,
                boxSizing: 'border-box',
              }}
            />
            {Boolean(fieldState.error?.message) && (
              <FormError slot="error">{fieldState.error?.message}</FormError>
            )}
          </FormField>
        )}
      />
    </div>
  );
};
