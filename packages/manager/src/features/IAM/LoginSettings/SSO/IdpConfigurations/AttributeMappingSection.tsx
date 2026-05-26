import {
  FormError,
  FormField,
  FormLabel,
  Select,
  TextField,
} from '@akamai/cds-components/react';
import * as React from 'react';
import { Controller } from 'react-hook-form';
import type { Control, UseFormWatch } from 'react-hook-form';

import { idpConfiguration } from '../../constants';
import styles from './IdpConfigurationDrawer.module.css';
import {
  type IdentityElementOption,
  identityElementOptions,
} from './idpConfigurationDrawer.utils';

import type { CreateIdpConfigPayload } from '@linode/api-v4';

interface Props {
  control: Control<CreateIdpConfigPayload>;
  watch: UseFormWatch<CreateIdpConfigPayload>;
}

export const AttributeMappingSection = ({ control, watch }: Props) => {
  return (
    <>
      <h3 className={styles.sectionHeading}>Attribute Mapping</h3>
      <p className={styles.sectionDescription}>
        {idpConfiguration.attributeMappingDescription}
      </p>

      <Controller
        control={control}
        name="saml.identity_element"
        render={({ field, fieldState }) => (
          <>
            <FormLabel className={styles.formLabel}>Identity Element</FormLabel>
            <FormField
              className={styles.formFieldSelect}
              error={!!fieldState.error}
            >
              <Select
                items={identityElementOptions}
                onChange={(event) => {
                  const selected = (event as CustomEvent)
                    .detail as IdentityElementOption | null;
                  if (selected) {
                    field.onChange(selected.value);
                  }
                }}
                placeholder="Select identity element"
                selected={
                  identityElementOptions.find(
                    (opt) => opt.value === field.value
                  ) ?? null
                }
                valueFn={(item) => (item as IdentityElementOption).label}
              />
              {fieldState.error && (
                <FormError>{fieldState.error.message}</FormError>
              )}
            </FormField>
          </>
        )}
      />

      {watch('saml.identity_element') === 'user_id_attribute' && (
        <Controller
          control={control}
          name="saml.user_id_attribute"
          render={({ field, fieldState }) => (
            <>
              <FormLabel className={styles.formLabel}>Attribute Name</FormLabel>
              <FormField
                className={styles.formFieldText}
                error={!!fieldState.error}
              >
                <TextField
                  onChange={field.onChange}
                  placeholder="Enter an attribute name"
                  value={field.value ?? ''}
                />
                {fieldState.error && (
                  <FormError>{fieldState.error.message}</FormError>
                )}
                <p className={styles.helperText}>
                  {idpConfiguration.attributeNameHelperText}
                </p>
              </FormField>
            </>
          )}
        />
      )}
    </>
  );
};
