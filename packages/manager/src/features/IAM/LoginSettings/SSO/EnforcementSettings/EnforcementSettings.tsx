import {
  Button,
  Checkbox,
  FormError,
  NotificationBanner,
} from '@akamai/cds-components/react';
import { Spacing } from '@akamai/cds-tokens';
import {
  useGetIdpConfigQuery,
  useGetIdpConfigsQuery,
  useGetIdpConfigUsersIncludedQuery,
  useUpdateIdpConfigMutation,
  useUpdateIdpConfigUsersIncludedMutation,
} from '@linode/queries';
import { enqueueSnackbar } from 'notistack';
import * as React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { CircleProgress } from 'src/features/IAM/Shared/CircleProgress/CircleProgress';
import { Divider } from 'src/features/IAM/Shared/Divider/Divider';
import { ErrorState } from 'src/features/IAM/Shared/ErrorState/ErrorState';
import { Paper } from 'src/features/IAM/Shared/Paper/Paper';

import { hasNoValidCertificates } from '../utilities';
import { ActivationStatus } from './ActivationStatus';
import { IncludedUsersPanel } from './IncludedUsersPanel';

import type { APIError, IdpUser } from '@linode/api-v4/lib/types';

export interface EnforcementSettingsFormValues {
  excludedUsers: string[];
  includedUsers: string[];
  isAcknowledged: boolean;
  ssoEnabled: boolean;
  ssoEnforced: boolean;
}

// TODO: Implement Enforcement Settings tab
// - Excluded users list management (break-glass users that bypass SSO)
export const EnforcementSettings = () => {
  // TODO: check whether we need to fetch all IDP configs to find the relevant one
  // or if we can get the euuid from IDP configuration tab and pass it down
  const {
    data: idpConfigs,
    error: idpConfigsError,
    isLoading: idpConfigsLoading,
  } = useGetIdpConfigsQuery();

  const euuid =
    idpConfigs && idpConfigs?.results > 0 ? idpConfigs.data[0].id : null;

  const {
    data: idpConfig,
    error,
    isLoading,
  } = useGetIdpConfigQuery(euuid ?? '');

  // We need to disabled Activation Status toggles if there are no valid certificates ans sso is disabled.
  // If sso is enabled, no action needed.
  const isConfigInvalid = idpConfig ? hasNoValidCertificates(idpConfig) : false;

  const {
    mutateAsync: updateActivationStatus,
    isPending: isActivationStatusPending,
  } = useUpdateIdpConfigMutation(euuid ?? '');

  const {
    mutateAsync: updateIncludedUsers,
    isPending: isIncludedUsersPending,
  } = useUpdateIdpConfigUsersIncludedMutation(euuid ?? '');

  const {
    data: includedUsers,
    error: includedUsersError,
    isLoading: includedUsersLoading,
  } = useGetIdpConfigUsersIncludedQuery({
    euuid: euuid ?? '',
  });

  const includedUsersOptions = React.useMemo(() => {
    return includedUsers?.data.map((user: IdpUser) => user.label);
  }, [includedUsers]);

  const form = useForm<EnforcementSettingsFormValues>({
    values: {
      ssoEnabled: idpConfig?.enabled ?? false,
      ssoEnforced: idpConfig?.enforce ?? false,
      isAcknowledged: false,
      includedUsers: includedUsersOptions ?? [],
      excludedUsers: [],
    },
  });

  const {
    formState: { isDirty, dirtyFields, errors, isSubmitting },
    handleSubmit,
    control,
    reset,
    setError,
    getValues,
  } = form;

  // Determine if Activation Status has been modified to conditionally
  // require acknowledgment and call the right endpoint on submit
  const isActivationStatusDirty = !!(
    dirtyFields.ssoEnabled || dirtyFields.ssoEnforced
  );

  // Determine if Included Users has been modified to conditionally
  // call the right endpoint on submit
  const isIncludedUsersDirty = !!dirtyFields.includedUsers;

  const onSubmit = async (values: EnforcementSettingsFormValues) => {
    const mutations: Promise<unknown>[] = [];

    // Only update activation status if it has been modified
    if (isActivationStatusDirty) {
      mutations.push(
        updateActivationStatus({
          enabled: values.ssoEnabled,
          enforce: values.ssoEnforced,
        })
      );
    }

    // Only update included users if it has been modified
    if (isIncludedUsersDirty) {
      mutations.push(updateIncludedUsers({ usernames: values.includedUsers }));
    }

    try {
      await Promise.all(mutations);
      enqueueSnackbar(`SSO settings updated successfully.`, {
        variant: 'success',
      });
      reset({ ...getValues(), isAcknowledged: false }, { keepDirty: false });
    } catch (errors) {
      const apiErrors = errors as APIError[];
      setError('root', { message: apiErrors[0].reason });
    }
  };

  if (isLoading || idpConfigsLoading || includedUsersLoading) {
    return <CircleProgress />;
  }

  if (error || idpConfigsError || includedUsersError) {
    return <ErrorState />;
  }

  return (
    <FormProvider {...form}>
      {errors.root?.message && (
        <NotificationBanner
          style={{ marginBottom: Spacing.S16 }}
          text={errors.root?.message}
          type="error"
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper
          marginBottom={Spacing.S16}
          padding={Spacing.S24}
          paddingTop={Spacing.S24}
        >
          <ActivationStatus isConfigInvalid={isConfigInvalid} />
          <Divider spacingBottom={Spacing.S16} spacingTop={Spacing.S16} />
          <IncludedUsersPanel includedUsers={includedUsersOptions} />
          <Divider spacingBottom={Spacing.S16} spacingTop={Spacing.S16} />
        </Paper>

        {isActivationStatusDirty && (
          <Controller
            control={control}
            name="isAcknowledged"
            render={({ field, fieldState }) => (
              <div>
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.detail as boolean)}
                  required
                >
                  I understand that my changes will be applied immediately and
                  will restrict standard login for all SSO-enforced users.
                </Checkbox>
                {Boolean(fieldState.error?.message) && (
                  <FormError slot="error" style={{ paddingLeft: Spacing.S32 }}>
                    {fieldState.error?.message}
                  </FormError>
                )}
              </div>
            )}
            rules={{
              validate: (value) =>
                value ||
                'You need to confirm that you understand the impact of applied changes.',
            }}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            disabled={!isDirty}
            processing={
              isSubmitting ||
              isActivationStatusPending ||
              isIncludedUsersPending
            }
            type="submit"
            variant="primary"
          >
            Update SSO Enforcement
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
