import { waitFor } from '@testing-library/react';

import { getShadowRootElement } from 'src/utilities/testHelpers';

export const expectNotificationBannerText = async (text: string) => {
  await waitFor(() => {
    const banners = Array.from(
      document.querySelectorAll<HTMLElement>('cds-notification-banner')
    );

    expect(
      banners.some((banner) =>
        (banner.shadowRoot?.textContent ?? '').includes(text)
      )
    ).toBe(true);
  });
};

/**
 * Prevents `cds-modal` from portaling itself to `document.body` during tests.
 * The modal moves to `document.body` when open, which breaks React's DOM
 * cleanup. Call this inside `beforeEach` and pair with `vi.restoreAllMocks()`
 * in `afterEach`.
 */
export const preventCdsModalPortaling = () => {
  vi.spyOn(document.body, 'appendChild').mockImplementation(function (
    this: HTMLElement,
    node
  ) {
    if (node instanceof Element && node.tagName === 'CDS-MODAL') {
      return node as any;
    }
    return HTMLElement.prototype.appendChild.call(this, node);
  });
};

/**
 * Returns the `cds-button` host element whose trimmed text content matches the
 * given label.
 */
export const getCdsButtonHostByText = (
  root: ParentNode,
  text: string
): HTMLElement | undefined =>
  Array.from(root.querySelectorAll<HTMLElement>('cds-button')).find(
    (button) => button.textContent?.trim() === text
  );

/**
 * Resolves the real `<button>` element inside the shadow DOM of the
 * `cds-button` whose text content matches the given label.
 */
export const getCdsButtonByText = async (
  root: ParentNode,
  text: string
): Promise<HTMLButtonElement | null> => {
  const host = getCdsButtonHostByText(root, text);
  if (!host) {
    return null;
  }
  return getShadowRootElement<HTMLButtonElement>(host, 'button');
};
