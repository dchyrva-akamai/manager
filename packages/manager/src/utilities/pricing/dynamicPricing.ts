import type { PriceType } from '@akamai/compute-ui-core/api';
import type { Region, RegionPriceObject } from '@linode/api-v4';

export interface RegionPrice extends RegionPriceObject {
  id: string;
}

// TODO: Delete once all products are using /types endpoints.
export interface DataCenterPricingOptions {
  /**
   * The base price for an entity.
   * @example 5 or 5.50
   */
  basePrice: number;
  /**
   * The `id` of the region we intended to get the price for.
   * @example us-east
   */
  regionId: Region['id'] | undefined;
}

export interface DataCenterPricingByTypeOptions {
  /**
   * The number of decimal places to return for the price.
   *  @default 2
   */
  decimalPrecision?: number;
  /**
   * The time period for which to find pricing data for (hourly or monthly).
   *  @default monthly
   */
  interval?: 'hourly' | 'monthly';
  /**
   * The `id` of the region we intended to get the price for.
   * @example us-east
   */
  regionId: Region['id'] | undefined;
  /**
   * Optionally allows price to be calculated by a factor of entity size.
   * @example 20 (GB) for a volume
   */
  size?: number;
  /**
   * The type data from a product's /types endpoint.
   */
  type: PriceType | undefined;
}
