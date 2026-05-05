import { waitForAdobeAnalyticsToBeLoaded } from './utils';

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
