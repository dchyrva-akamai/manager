import type { IdpConfig } from '@linode/api-v4';

// Determine if there is no valid certificates: either there are no certificates at all,
//  or all certificates are expired.
export const hasNoValidCertificates = (idpConfig: IdpConfig) => {
  const certs = idpConfig.saml.public_certificates;

  if (certs.length === 0) return true;

  const now = new Date().toISOString();
  return certs.every((cert) => cert.not_after < now);
};

// Generate summary status message for IDP configuration based on enabled, enforce, included_users_count and excluded_users_count fields.
export const getSummaryStatus = (idpConfig: IdpConfig | null): string => {
  if (!idpConfig) {
    return 'SSO is not configured for this account.';
  }

  if (!idpConfig.enabled) {
    return 'SSO is disabled. All users log in using alternative methods.';
  }

  // enabled = true and enforce = false and included_users_count > 0
  if (!idpConfig.enforce && idpConfig.included_users_count > 0) {
    return `SSO is enforced for ${idpConfig.included_users_count} included users. Other users log in using alternative methods.`;
  }

  // enabled = true and enforce = false and included_users_count = 0
  if (!idpConfig.enforce) {
    return 'SSO is enabled but not enforced. All users log in using alternative methods.';
  }

  // enabled = true and enforce = true and excluded_users_count > 0
  if (idpConfig.excluded_users_count > 0) {
    return `SSO is enforced. All users log in with SSO, except for ${idpConfig.excluded_users_count} excluded users.`;
  }

  // enabled = true and enforce = true and excluded_users_count = 0
  return 'SSO is enforced. All users log in with SSO.';
};
