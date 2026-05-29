import {
  lkeHighAvailabilityTypeFactory,
  nodeBalancerTypeFactory,
  volumeTypeFactory,
} from 'src/factories/types';

import { getDCSpecificPrice, getDCSpecificPriceByType } from './dynamicPricing';

describe('getDCSpecificPricingDisplay', () => {
  it('calculates dynamic pricing for a region without an increase', () => {
    expect(
      getDCSpecificPrice({
        basePrice: 20,
        regionId: 'us-east',
      })
    ).toBe('20.00');
  });

  it('calculates dynamic pricing for a region with an increase', () => {
    expect(
      getDCSpecificPrice({
        basePrice: 20,
        regionId: 'id-cgk',
      })
    ).toBe('24.00');

    expect(
      getDCSpecificPrice({
        basePrice: 20,
        regionId: 'br-gru',
      })
    ).toBe('28.00');
  });

  it('handles default case correctly', () => {
    expect(
      getDCSpecificPrice({
        basePrice: 0,
        regionId: 'invalid-region',
      })
    ).toBe(undefined);
  });
});

describe('getDCSpecificPricingByType', () => {
  const mockNodeBalancerType = nodeBalancerTypeFactory.build();
  const mockVolumeType = volumeTypeFactory.build();
  const mockLKEHighAvailabilityType = lkeHighAvailabilityTypeFactory.build();

  it('calculates dynamic pricing for a region without an increase', () => {
    expect(
      getDCSpecificPriceByType({
        regionId: 'us-east',
        type: mockNodeBalancerType,
      })
    ).toBe('10.00');

    expect(
      getDCSpecificPriceByType({
        regionId: 'us-east',
        type: mockLKEHighAvailabilityType,
      })
    ).toBe('60.00');
  });

  it('calculates dynamic pricing for a region with an increase', () => {
    expect(
      getDCSpecificPriceByType({
        regionId: 'id-cgk',
        type: mockNodeBalancerType,
      })
    ).toBe('12.00');

    expect(
      getDCSpecificPriceByType({
        regionId: 'br-gru',
        type: mockNodeBalancerType,
      })
    ).toBe('14.00');

    expect(
      getDCSpecificPriceByType({
        regionId: 'id-cgk',
        type: mockLKEHighAvailabilityType,
      })
    ).toBe('72.00');

    expect(
      getDCSpecificPriceByType({
        regionId: 'br-gru',
        type: mockLKEHighAvailabilityType,
      })
    ).toBe('84.00');
  });

  it('calculates dynamic pricing for a region without an increase on an hourly interval to the specified decimal', () => {
    expect(
      getDCSpecificPriceByType({
        decimalPrecision: 3,
        interval: 'hourly',
        regionId: 'us-east',
        type: mockNodeBalancerType,
      })
    ).toBe('0.015');
  });

  it('calculates dynamic pricing for a region with an increase on an hourly interval to the specified decimal', () => {
    expect(
      getDCSpecificPriceByType({
        decimalPrecision: 3,
        interval: 'hourly',
        regionId: 'id-cgk',
        type: mockNodeBalancerType,
      })
    ).toBe('0.018');
  });

  it('calculates dynamic pricing for a volume based on size', () => {
    expect(
      getDCSpecificPriceByType({
        regionId: 'id-cgk',
        size: 20,
        type: mockVolumeType,
      })
    ).toBe('2.40');
  });

  it('handles an invalid price if region is not available', () => {
    expect(
      getDCSpecificPriceByType({
        regionId: 'us-east',
        type: undefined,
      })
    ).toBe(undefined);
  });

  it('handles an invalid price if type is not available', () => {
    expect(
      getDCSpecificPriceByType({
        regionId: undefined,
        type: mockNodeBalancerType,
      })
    ).toBe(undefined);
  });
});
