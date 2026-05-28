export const idpConfiguration = {
  addButtonMaxTooltip: 'You can add up to 10 certificates.',
  allCertificatesDeletedError:
    'IDP configuration requires at least one active certificate. ',
  attributeMappingDescription:
    'Select which element in the SAML assertion you want to use to identify the user.',
  attributeNameHelperText:
    'The name needs to match the attribute key configured in your IDP.',
  createSuccess: 'IDP configuration created successfully.',
  identityProviderDescription:
    'Use the IDP metadata from your identity provider (IDP) to create the configuration.',
  updateSuccess: 'IDP configuration updated successfully.',
} as const;

export const METADATA_HREF = 'https://login.linode.com/saml/sp/metadata';
