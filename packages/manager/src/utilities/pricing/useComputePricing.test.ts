import { renderHook } from '@testing-library/react';

import { wrapWithTheme } from '../testHelpers';
import { useComputePricing } from './useComputePricing';

import type { PriceObject } from '@linode/api-v4';

describe('useComputePricing', () => {
  describe.each(['monthly', 'hourly'] as const)(
    `when billing is '%s'`,
    (billing) => {
      const price: PriceObject = { hourly: 0.015, monthly: 10 };
      const options = {
        flags: {
          computePricing: {
            activeBillingPlanMatchers: [],
            banner: { learnMoreLink: '', text: '' },
            billing,
          },
        },
      };

      it('returns correct billing', () => {
        const { result } = renderHook(() => useComputePricing(), {
          wrapper: (ui) => wrapWithTheme(ui, options),
        });
        expect(result.current.billing).toBe(billing);
      });

      it('getPrice returns correct value or UNKNOWN_PRICE', () => {
        const { result } = renderHook(() => useComputePricing(), {
          wrapper: (ui) => wrapWithTheme(ui, options),
        });
        expect(result.current.getPrice(price)).toBe(price[billing]);
        expect(result.current.getPrice(null)).toBe('--.--');
        expect(result.current.getPrice(undefined)).toBe('--.--');
      });

      it('formatPrice returns formatted string', () => {
        const { result } = renderHook(() => useComputePricing(), {
          wrapper: (ui) => wrapWithTheme(ui, options),
        });
        expect(typeof result.current.formatPrice(price)).toBe('string');
      });

      it('priceLabel returns correct label', () => {
        const { result } = renderHook(() => useComputePricing(), {
          wrapper: (ui) => wrapWithTheme(ui, options),
        });
        expect(['hour', 'month']).toContain(result.current.priceLabel);
      });
    }
  );

  describe('planTypeId scoping via activeBillingPlanMatchers', () => {
    it('falls back to monthly when the computePricing flag is off (undefined)', () => {
      // Flag not set at all - baseBilling defaults to 'monthly'.
      const { result } = renderHook(
        () => useComputePricing('g8-gpu-a100-80gb'),
        {
          wrapper: (ui) => wrapWithTheme(ui, { flags: {} }),
        }
      );
      expect(result.current.billing).toBe('monthly');
    });

    it('returns baseBilling for all plans when activeBillingPlanMatchers is empty', () => {
      // No matchers configured - every plan gets baseBilling regardless of its id.
      const options = {
        flags: {
          computePricing: {
            activeBillingPlanMatchers: [],
            banner: { learnMoreLink: '', text: '' },
            billing: 'hourly' as const,
          },
        },
      };
      const { result } = renderHook(
        () => useComputePricing('g8-gpu-a100-80gb'),
        {
          wrapper: (ui) => wrapWithTheme(ui, options),
        }
      );
      expect(result.current.billing).toBe('hourly');
    });

    it("returns baseBilling ('hourly') when planTypeId matches a matcher", () => {
      // The plan id contains 'gpu' which matches the configured matcher.
      const options = {
        flags: {
          computePricing: {
            activeBillingPlanMatchers: ['gpu', 'g8'],
            banner: { learnMoreLink: '', text: '' },
            billing: 'hourly' as const,
          },
        },
      };
      const { result } = renderHook(
        () => useComputePricing('g8-gpu-a100-80gb'),
        {
          wrapper: (ui) => wrapWithTheme(ui, options),
        }
      );
      expect(result.current.billing).toBe('hourly');
    });

    it("falls back to 'monthly' when planTypeId does not match any matcher", () => {
      // The plan id 'g6-dedicated-16' does not contain 'gpu' or 'g8',
      // so it falls back to monthly even though baseBilling is 'hourly'.
      const options = {
        flags: {
          computePricing: {
            activeBillingPlanMatchers: ['gpu', 'g8'],
            banner: { learnMoreLink: '', text: '' },
            billing: 'hourly' as const,
          },
        },
      };
      const { result } = renderHook(
        () => useComputePricing('g6-dedicated-16'),
        {
          wrapper: (ui) => wrapWithTheme(ui, options),
        }
      );
      expect(result.current.billing).toBe('monthly');
    });

    it("always returns 'monthly' for all plans when baseBilling is 'monthly', even if matchers are set", () => {
      // Scoping only has meaningful effect when baseBilling is non-monthly.
      // When baseBilling is 'monthly', every plan stays on monthly regardless.
      const options = {
        flags: {
          computePricing: {
            activeBillingPlanMatchers: ['gpu', 'g8'],
            banner: { learnMoreLink: '', text: '' },
            billing: 'monthly' as const,
          },
        },
      };
      const matchingPlan = renderHook(
        () => useComputePricing('g8-gpu-a100-80gb'),
        {
          wrapper: (ui) => wrapWithTheme(ui, options),
        }
      );
      const nonMatchingPlan = renderHook(
        () => useComputePricing('g6-dedicated-16'),
        {
          wrapper: (ui) => wrapWithTheme(ui, options),
        }
      );
      expect(matchingPlan.result.current.billing).toBe('monthly');
      expect(nonMatchingPlan.result.current.billing).toBe('monthly');
    });

    it('matcher comparison is case-insensitive', () => {
      // Matchers should match regardless of casing in either the plan id or the matcher string.
      const options = {
        flags: {
          computePricing: {
            activeBillingPlanMatchers: ['GPU'],
            banner: { learnMoreLink: '', text: '' },
            billing: 'hourly' as const,
          },
        },
      };
      const { result } = renderHook(
        () => useComputePricing('g8-gpu-a100-80gb'),
        {
          wrapper: (ui) => wrapWithTheme(ui, options),
        }
      );
      expect(result.current.billing).toBe('hourly');
    });

    it('returns baseBilling when planTypeId is null (treated as no planTypeId)', () => {
      // null planTypeId is the same as omitting it - no scoping, baseBilling applies.
      const options = {
        flags: {
          computePricing: {
            activeBillingPlanMatchers: ['gpu'],
            banner: { learnMoreLink: '', text: '' },
            billing: 'hourly' as const,
          },
        },
      };
      const { result } = renderHook(() => useComputePricing(null), {
        wrapper: (ui) => wrapWithTheme(ui, options),
      });
      expect(result.current.billing).toBe('hourly');
    });
  });
});
