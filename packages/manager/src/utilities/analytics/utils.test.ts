import { checkOptanonConsent } from '@akamai/compute-ui-core/analytics';

import {
  getCookie,
  getFormattedStringFromFormEventOptions,
  ONE_TRUST_COOKIE_CATEGORIES,
  waitForAdobeAnalyticsToBeLoaded,
} from './utils';

import type { FormEventOptions } from './types';

describe('getCookie', () => {
  beforeAll(() => {
    const mockCookies =
      'mycookie=my-cookie-value; OptanonConsent=cookie-consent-here; mythirdcookie=my-third-cookie;';
    vi.spyOn(document, 'cookie', 'get').mockReturnValue(mockCookies);
  });

  it('should return the value of a cookie from document.cookie given its name, given cookie in middle position', () => {
    expect(getCookie('OptanonConsent')).toEqual('cookie-consent-here');
  });

  it('should return the value of a cookie from document.cookie given its name, given cookie in first position', () => {
    expect(getCookie('mycookie')).toEqual('my-cookie-value');
  });

  it('should return the value of a cookie from document.cookie given its name, given cookie in last position', () => {
    expect(getCookie('mythirdcookie')).toEqual('my-third-cookie');
  });

  it('should return undefined if the cookie does not exist in document.cookie', () => {
    expect(getCookie('mysecondcookie')).toEqual(undefined);
  });
});

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

describe('getFormattedStringFromFormEventOptions', () => {
  const formEventOptionsWithHeaders: FormEventOptions = {
    headerName: 'Header',
    interaction: 'click',
    label: 'Component label',
    subheaderName: 'Subheader',
  };

  it('should return a string in format "Header:Subheader|Interaction:Component label"', () => {
    expect(
      getFormattedStringFromFormEventOptions(formEventOptionsWithHeaders)
    ).toEqual('Header:Subheader|click:Component label');
  });

  it('should return defaults if no header or subheader are provided', () => {
    const formEventOptionsWithoutHeaders: FormEventOptions = {
      interaction: 'click',
      label: 'Component label',
    };

    expect(
      getFormattedStringFromFormEventOptions(formEventOptionsWithoutHeaders)
    ).toEqual('No header|click:Component label');
  });

  it("should append ':once' to the label's end to identify events to track once per page view", () => {
    const formEventOptionsTrackOnce = {
      ...formEventOptionsWithHeaders,
      trackOnce: true,
    };
    expect(
      getFormattedStringFromFormEventOptions(formEventOptionsTrackOnce)
    ).toEqual('Header:Subheader|click:Component label:once');
  });
});
