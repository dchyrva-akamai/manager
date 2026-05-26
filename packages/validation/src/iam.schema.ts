import { array, boolean, object, string } from 'yup';

export const CreateIdpConfigSchema = object({
  default: boolean(),
  enabled: boolean(),
  enforce: boolean(),
  label: string()
    .required('This field is required.')
    .min(1, 'Label must be at least 1 character.')
    .max(128, 'Label can have up to 128 characters.')
    .matches(
      /^[A-Za-z0-9 _.-]+$/,
      'Label can contain only letters, numbers, spaces, underscores, dashes, and periods.',
    ),
  saml: object({
    entity_id: string()
      .required('This field is required.')
      .min(1, 'Entity ID must be at least 1 character.')
      .max(255, 'Entity ID can have up to 255 characters.'),
    identity_element: string().required('This field is required.'),
    idp_url: string()
      .required('This field is required.')
      .max(255, 'IDP URL must be at most 255 characters.')
      .test('is-valid-idp-url', function (value) {
        if (!value) {
          return true;
        }

        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return this.createError({
            message: 'IDP URL needs to start with http:// or https://.',
          });
        }

        try {
          new URL(value);
          return true;
        } catch {
          return this.createError({
            message: 'IDP URL needs to be a valid URL.',
          });
        }
      }),
    public_certificates: array()
      .of(
        object({
          certificate: string()
            .required('This field is required.')
            .max(4000, 'Certificate must be at most 4000 characters.'),
        }),
      )
      .min(1, 'At least one SAML Public Certificate is required.')
      .max(10, 'At most 10 certificates are allowed.'),
    user_id_attribute: string().when('identity_element', {
      is: 'user_id_attribute',
      then: (schema) =>
        schema
          .required('This field is required.')
          .min(1, 'Attribute Name must be at least 1 character.')
          .max(255, 'Attribute name can have up to 255 characters.'),
    }),
  }),
});

export const UpdateIdpConfigSchema = object({
  default: boolean(),
  enabled: boolean(),
  enforce: boolean(),
  label: string()
    .required('This field is required.')
    .min(1, 'Label must be at least 1 character.')
    .max(128, 'Label can have up to 128 characters.')
    .matches(
      /^[A-Za-z0-9 _.-]+$/,
      'Label can contain only letters, numbers, spaces, underscores, dashes, and periods.',
    ),
  saml: object({
    entity_id: string()
      .required('This field is required.')
      .min(1, 'Entity ID must be at least 1 character.')
      .max(255, 'Entity ID can have up to 255 characters.'),
    identity_element: string()
      .required('This field is required.')
      .oneOf(
        ['user_id_attribute', 'name_id'],
        'Identity Element must be user_id_attribute or name_id.',
      ),
    idp_url: string()
      .required('This field is required.')
      .max(255, 'IDP URL must be at most 255 characters.')
      .test('is-valid-idp-url', function (value) {
        if (!value) {
          return true;
        }

        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return this.createError({
            message: 'IDP URL needs to start with http:// or https://.',
          });
        }

        try {
          new URL(value);
          return true;
        } catch {
          return this.createError({
            message: 'IDP URL needs to be a valid URL.',
          });
        }
      }),
    public_certificates: array().of(
      object({
        certificate: string().max(
          4000,
          'Certificate must be at most 4000 characters.',
        ),
      }),
    ),
    user_id_attribute: string().when('identity_element', {
      is: 'user_id_attribute',
      then: (schema) =>
        schema
          .required('Attribute Name is required.')
          .min(1, 'Attribute Name must be at least 1 character.')
          .max(255, 'Attribute name can have up to 255 characters.'),
    }),
  }),
});
