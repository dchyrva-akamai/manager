import type { Status } from '../../../Shared/StatusIcon/StatusIcon';
import type { CreateIdpConfigPayload, IdentityElement } from '@linode/api-v4';

export type DrawerMode = 'create' | 'edit';

export interface IdentityElementOption {
  label: string;
  value: IdentityElement;
}

export const identityElementOptions: IdentityElementOption[] = [
  { label: 'User ID Attribute', value: 'user_id_attribute' },
  { label: 'Name ID', value: 'name_id' },
];

export const defaultValues: CreateIdpConfigPayload = {
  default: false,
  enabled: false,
  enforce: false,
  label: '',
  saml: {
    entity_id: '',
    identity_element: '' as IdentityElement,
    idp_url: '',
    public_certificates: [{ certificate: '' }],
  },
};

/**
 * Returns a status based on the certificate's expiration date.
 * - 'error' (red): already expired
 * - 'other' (yellow): expires within 90 days
 * - 'active' (green): valid for more than 90 days
 */
export const getCertificateStatus = (notAfter: string): Status => {
  const expirationDate = new Date(notAfter);
  const now = new Date();

  if (expirationDate <= now) {
    return 'error';
  }

  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

  if (expirationDate <= ninetyDaysFromNow) {
    return 'other';
  }

  return 'active';
};

/**
 * Truncates a certificate string for display in the table.
 */
export const truncateCertificate = (cert: string): string => {
  if (cert.length <= 30) {
    return cert;
  }
  return `${cert.slice(0, 10)} ... ${cert.slice(-10)}`;
};
