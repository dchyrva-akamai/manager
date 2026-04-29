import { waitFor } from '@testing-library/react';

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
