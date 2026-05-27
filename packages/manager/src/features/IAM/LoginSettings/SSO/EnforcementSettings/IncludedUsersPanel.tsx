import {
  Badge,
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
  SSO_INCLUDED_USERS_DOCS_LINK,
} from 'src/features/IAM/Shared/constants';
import { Link } from 'src/features/IAM/Shared/Link/Link';

import type { EnforcementSettingsFormValues } from './EnforcementSettings';
import type { TagInputElement } from '@akamai/cds-components';

interface Props {
  includedUsers: string[] | undefined;
}

export const IncludedUsersPanel = ({ includedUsers }: Props) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const { control, watch } = useFormContext<EnforcementSettingsFormValues>();

  // Watch SSO enabled/enforced states to conditionally update badge status`
  const isSSOEnabled = watch('ssoEnabled');
  const isSSOEnforced = watch('ssoEnforced');

  // TODO:  CDS - UIE-11408 - replace after tag input supports passing in options directly
  // instead of using ref to set preselected options
  const tagInputRef = React.useCallback(
    (node: null | TagInputElement<string>) => {
      if (node && includedUsers && includedUsers.length > 0) {
        node.setValue(includedUsers);
      }
    },
    [includedUsers]
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

  // TODO - CDS: UIE-11455: replace with useAccountUsersInfiniteQuery when tag input supports infinite loading
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
      <div style={{ display: 'flex', gap: Spacing.S12 }}>
        <h2
          style={{
            marginTop: Spacing.S0,
            marginBottom: Spacing.S12,
            font: Typography.Heading.S,
          }}
        >
          Included users
        </h2>
        <Badge color={isSSOEnabled && !isSSOEnforced ? 'green' : 'neutral'}>
          {isSSOEnabled && !isSSOEnforced ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      <p
        style={{
          marginTop: Spacing.S0,
          marginBottom: Spacing.S12,
        }}
      >
        Before enforcing SSO for all users, enable it for included users only to
        test the SSO login flow. With SSO enforced globally, this list doesn’t
        apply. <Link to={SSO_INCLUDED_USERS_DOCS_LINK}>Learn more.</Link>
      </p>
      <Controller
        control={control}
        name="includedUsers"
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
              Included Users
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
