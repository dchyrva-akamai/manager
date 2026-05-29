import {
  Button,
  FormError,
  FormField,
  FormLabel,
  NotificationBanner,
  TextArea,
} from '@akamai/cds-components/react';
import { Spacing } from '@akamai/cds-tokens';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateIdpCertificateMutation } from '@linode/queries';
import { Drawer } from '@linode/ui';
import { AddCertificateSchema } from '@linode/validation';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import styles from './IdpConfigurationDrawer.module.css';

interface FormValues {
  certificate: string;
}

interface Props {
  idpConfigId: string;
  onClose: () => void;
  open: boolean;
}

const defaultValues: FormValues = {
  certificate: '',
};

export const AddCertificateDrawer = ({ idpConfigId, onClose, open }: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: createIdpCertificate, isPending } =
    useCreateIdpCertificateMutation(idpConfigId);

  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    reset,
    setError,
  } = useForm<FormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(AddCertificateSchema) as Resolver<FormValues>,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async ({ certificate }: FormValues) => {
    try {
      await createIdpCertificate({
        certificate: certificate.trim(),
      });

      enqueueSnackbar('Certificate added successfully.', {
        variant: 'success',
      });

      handleClose();
    } catch (errors) {
      const apiErrors = Array.isArray(errors) ? errors : [];

      for (const error of apiErrors) {
        setError('root', {
          message: error.reason,
        });
      }
    }
  };

  return (
    // TODO: UIE-10784 - replace with CDS Drawer when available
    <Drawer onClose={handleClose} open={open} title="Add Certificate">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.message && (
          <NotificationBanner
            style={{ marginBottom: Spacing.S12 }}
            text={errors.root.message}
            type="error"
          />
        )}

        <p style={{ marginTop: Spacing.S24, marginBottom: Spacing.S24 }}>
          Enter a SAML certificate for the IDP configuration.
        </p>

        <Controller
          control={control}
          name="certificate"
          render={({ field, fieldState }) => (
            <FormField
              className={styles.formFieldCertificate}
              error={!!fieldState.error}
              label-position="top"
            >
              <FormLabel label-position="top" slot="label">
                SAML Public Certificate
              </FormLabel>
              <TextArea
                aria-invalid={!!fieldState.error}
                error={!!fieldState.error}
                onChange={field.onChange}
                placeholder="Enter a SAML public certificate"
                rows={4}
                value={field.value}
              />
              <FormError>{fieldState?.error?.message}</FormError>
            </FormField>
          )}
        />

        <div className={styles.actions}>
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>

          <Button
            disabled={!isValid}
            processing={isSubmitting || isPending}
            type="submit"
            variant="primary"
          >
            Add Certificate
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
