import type { IdpConfig } from '@linode/api-v4';

// Determine if there is no valid certificates: either there are no certificates at all,
//  or all certificates are expired.
export const hasNoValidCertificates = (idpConfig: IdpConfig) => {
  const certs = idpConfig.saml.public_certificates;

  if (certs.length === 0) return true;

  const now = new Date().toISOString();
  return certs.every((cert) => cert.not_after < now);
};

export interface SummaryStatusConfig {
  enabled: boolean;
  enforce: boolean;
  excluded_users_count: number;
  included_users_count: number;
}

// Generate summary status message for IDP configuration based on enabled, enforce, included_users_count and excluded_users_count fields.
export const getSummaryStatus = (
  idpConfig: null | SummaryStatusConfig,
  isSummary?: boolean
): string => {
  if (!idpConfig) {
    return 'SSO is not configured for this account.';
  }

  // enabled = false
  if (!idpConfig.enabled) {
    return `SSO is disabled${isSummary ? ' and not enforced' : ''}. All users log in using alternative methods.`;
  }

  // enabled = true and enforce = false and included_users_count > 0
  if (!idpConfig.enforce && idpConfig.included_users_count > 0) {
    return `${isSummary ? 'SSO is enabled and enforced' : 'SSO is enforced'} for ${idpConfig.included_users_count} included user${idpConfig.included_users_count > 1 ? 's' : ''}. Other users log in using alternative methods.`;
  }

  // enabled = true and enforce = false and included_users_count = 0
  if (!idpConfig.enforce) {
    return `SSO is enabled but not enforced${isSummary ? ' for any users.' : '.'} All users log in using alternative methods.`;
  }

  // enabled = true and enforce = true and excluded_users_count > 0
  if (idpConfig.excluded_users_count > 0) {
    return `SSO is ${isSummary ? 'enabled and enforced. All users are required to' : 'enforced. All users'} log in with SSO, except for ${idpConfig.excluded_users_count} excluded user${idpConfig.excluded_users_count > 1 ? 's' : ''}.`;
  }

  // enabled = true and enforce = true and excluded_users_count = 0
  return isSummary
    ? 'SSO is enabled and enforced. All users are required to log in with SSO. There are no excluded users (not recommended).'
    : 'SSO is enforced. All users log in with SSO.';
};
