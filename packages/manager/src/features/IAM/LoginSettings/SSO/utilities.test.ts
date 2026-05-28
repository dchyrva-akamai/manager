import { getSummaryStatus, hasNoValidCertificates } from './utilities';

import type { IdpConfig } from '@linode/api-v4';

const FUTURE_DATE = '2099-01-01T00:00:00.000Z';
const PAST_DATE = '2000-01-01T00:00:00.000Z';

const makeCert = (not_after: string) => ({
  certificate: 'cert',
  created: '2024-01-01T00:00:00.000Z',
  created_by: 'user',
  id: 'cert-id',
  not_after,
  not_before: '2024-01-01T00:00:00.000Z',
});

const makeConfig = (certs: ReturnType<typeof makeCert>[]): IdpConfig => ({
  created: '2024-01-01T00:00:00.000Z',
  created_by: 'user',
  default: true,
  enabled: false,
  enforce: false,
  excluded_users_count: 0,
  id: 'config-id',
  included_users_count: 0,
  label: 'Test IDP',
  saml: {
    entity_id: 'entity-id',
    identity_element: 'name_id',
    idp_url: 'https://idp.example.com',
    public_certificates: certs,
  },
  updated: '2024-01-01T00:00:00.000Z',
  updated_by: 'user',
});

describe('hasNoValidCertificates', () => {
  it('returns true when there are no certificates', () => {
    expect(hasNoValidCertificates(makeConfig([]))).toBe(true);
  });

  it('returns true when there is one expired certificate', () => {
    expect(hasNoValidCertificates(makeConfig([makeCert(PAST_DATE)]))).toBe(
      true
    );
  });

  it('returns false when there is one valid certificate', () => {
    expect(hasNoValidCertificates(makeConfig([makeCert(FUTURE_DATE)]))).toBe(
      false
    );
  });

  it('returns false when there are multiple certificates and at least one is valid', () => {
    expect(
      hasNoValidCertificates(
        makeConfig([makeCert(PAST_DATE), makeCert(FUTURE_DATE)])
      )
    ).toBe(false);
  });

  it('returns true when there are multiple certificates and all are expired', () => {
    expect(
      hasNoValidCertificates(
        makeConfig([makeCert(PAST_DATE), makeCert(PAST_DATE)])
      )
    ).toBe(true);
  });
});

describe('getSummaryStatus', () => {
  it('returns not-configured message when idpConfig is null', () => {
    expect(getSummaryStatus(null)).toBe(
      'SSO is not configured for this account.'
    );
  });

  it('returns disabled message when enabled is false', () => {
    expect(getSummaryStatus(makeConfig([]))).toBe(
      'SSO is disabled. All users log in using alternative methods.'
    );
  });

  it('returns disabled message when enabled is false for summary', () => {
    expect(getSummaryStatus(makeConfig([]), true)).toBe(
      'SSO is disabled and not enforced. All users log in using alternative methods.'
    );
  });

  it('returns not-enforced message when enabled and enforce are false and included_users_count is 0', () => {
    expect(
      getSummaryStatus({
        ...makeConfig([]),
        enabled: true,
        enforce: false,
        included_users_count: 0,
      })
    ).toBe(
      'SSO is enabled but not enforced. All users log in using alternative methods.'
    );
  });

  it('returns not-enforced message when enabled and enforce are false and included_users_count is 0 for summary', () => {
    expect(
      getSummaryStatus(
        {
          ...makeConfig([]),
          enabled: true,
          enforce: false,
          included_users_count: 0,
        },
        true
      )
    ).toBe(
      'SSO is enabled but not enforced for any users. All users log in using alternative methods.'
    );
  });

  it('returns partial enforcement message when enabled is true, enforce is false, and included_users_count > 0', () => {
    expect(
      getSummaryStatus({
        ...makeConfig([]),
        enabled: true,
        enforce: false,
        included_users_count: 3,
      })
    ).toBe(
      'SSO is enforced for 3 included users. Other users log in using alternative methods.'
    );
  });

  it('returns partial enforcement message when enabled is true, enforce is false, and included_users_count > 0 for summary', () => {
    expect(
      getSummaryStatus(
        {
          ...makeConfig([]),
          enabled: true,
          enforce: false,
          included_users_count: 3,
        },
        true
      )
    ).toBe(
      'SSO is enabled and enforced for 3 included users. Other users log in using alternative methods.'
    );
  });

  it('returns full enforcement message when enabled and enforce are true and excluded_users_count is 0', () => {
    expect(
      getSummaryStatus({
        ...makeConfig([]),
        enabled: true,
        enforce: true,
        excluded_users_count: 0,
      })
    ).toBe('SSO is enforced. All users log in with SSO.');
  });

  it('returns full enforcement message when enabled and enforce are true and excluded_users_count is 0 for summary', () => {
    expect(
      getSummaryStatus(
        {
          ...makeConfig([]),
          enabled: true,
          enforce: true,
          excluded_users_count: 0,
        },
        true
      )
    ).toBe(
      'SSO is enabled and enforced. All users are required to log in with SSO. There are no excluded users (not recommended).'
    );
  });

  it('returns enforcement-with-exclusions message when enabled and enforce are true and excluded_users_count > 0', () => {
    expect(
      getSummaryStatus({
        ...makeConfig([]),
        enabled: true,
        enforce: true,
        excluded_users_count: 5,
      })
    ).toBe(
      'SSO is enforced. All users log in with SSO, except for 5 excluded users.'
    );
  });

  it('returns enforcement-with-exclusions message when enabled and enforce are true and excluded_users_count > 0 for summary', () => {
    expect(
      getSummaryStatus(
        {
          ...makeConfig([]),
          enabled: true,
          enforce: true,
          excluded_users_count: 5,
        },
        true
      )
    ).toBe(
      'SSO is enabled and enforced. All users are required to log in with SSO, except for 5 excluded users.'
    );
  });
});
