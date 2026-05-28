import type { PriceObject, RegionPriceObject } from './linodes/types';

export type {
  APIFieldError as APIError,
  APIWarning,
  ConfigOverride,
  Filter,
  FilterConditionTypes,
  Params,
  RequestHeaders,
  RequestOptions,
  ResourcePage,
} from '@akamai/compute-ui-core/api';

export interface PriceType {
  id: string;
  label: string;
  price: PriceObject;
  region_prices: RegionPriceObject[];
  transfer: number;
}

// Credit: https://stackoverflow.com/a/47914643
//
// Allows consumer to apply Partial to each key in a nested interface.
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
