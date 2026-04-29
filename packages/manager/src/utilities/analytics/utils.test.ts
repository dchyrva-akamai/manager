import { checkOptanonConsent } from '@akamai/compute-ui-core/analytics';

import {
  ONE_TRUST_COOKIE_CATEGORIES,
  waitForAdobeAnalyticsToBeLoaded,
} from './utils';

describe('checkOptanonConsent', () => {
  it('should return true if consent is enabled for the given Optanon cookie category', () => {
    const mockPerformanceCookieConsentEnabled =
      'somestuffhere&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&intType=6';

    expect(
      checkOptanonConsent(
        mockPerformanceCookieConsentEnabled,
        ONE_TRUST_COOKIE_CATEGORIES['Performance Cookies']
      )
    ).toEqual(true);
  });

  it('should return false if consent is disabled for the given Optanon cookie category', () => {
    const mockPerformanceCookieConsentDisabled =
      'somestuffhere&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&intType=6';

    expect(
      checkOptanonConsent(
        mockPerformanceCookieConsentDisabled,
        ONE_TRUST_COOKIE_CATEGORIES['Performance Cookies']
      )
    ).toEqual(false);
  });

  it('should return false if the consent category does not exist in the cookie', () => {
    const mockNoPerformanceCookieCategory =
      'somestuffhere&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&intType=6';

    expect(
      checkOptanonConsent(
        mockNoPerformanceCookieCategory,
        ONE_TRUST_COOKIE_CATEGORIES['Performance Cookies']
      )
    ).toEqual(false);
  });

  it('should return false if the cookie is undefined', () => {
    expect(
      checkOptanonConsent(
        undefined,
        ONE_TRUST_COOKIE_CATEGORIES['Performance Cookies']
      )
    ).toEqual(false);
  });
});

describe('waitForAdobeAnalyticsToBeLoaded', () => {
  it('should resolve if adobe is defined ', () => {
    vi.stubGlobal('_satellite', {});
    expect(waitForAdobeAnalyticsToBeLoaded()).resolves.toBe(undefined);
  });

  it(
    'should reject if adobe is not defined after 5 seconds',
    { timeout: 30000 },
    () => {
      vi.stubGlobal('_satellite', undefined);
      expect(waitForAdobeAnalyticsToBeLoaded()).rejects.toThrow(
        'Adobe Analytics did not load after 5 seconds'
      );
    }
  );
});
