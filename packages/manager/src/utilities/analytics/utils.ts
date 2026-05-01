/**
 * Based on Login's OneTrust cookie list
 */
export const ONE_TRUST_COOKIE_CATEGORIES = {
  'Functional Cookies': 'C0003',
  'Performance Cookies': 'C0002', // Analytics cookies fall into this category
  'Social Media Cookies': 'C0004',
  'Strictly Necessary Cookies': 'C0001',
  'Targeting Cookies': 'C0005',
} as const;

/**
 * A Promise that will resolve once Adobe Analytics loads.
 *
 * @throws if Adobe does not load after 5 seconds
 */
export const waitForAdobeAnalyticsToBeLoaded = () =>
  new Promise<void>((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(() => {
      if (window._satellite) {
        resolve();
        clearInterval(interval);
        return;
      }

      attempts++;

      if (attempts >= 5) {
        reject('Adobe Analytics did not load after 5 seconds');
        clearInterval(interval);
      }
    }, 1000);
  });
