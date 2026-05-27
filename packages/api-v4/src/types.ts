import type { PriceObject, RegionPriceObject } from './linodes/types';
import type {
  APIFieldError as APIError,
  Filter,
  ResourcePage,
} from '@akamai/compute-ui-core/api';

export type { APIError, Filter, ResourcePage };

export interface APIWarning {
  detail: string;
  title: string;
}

export interface ConfigOverride {
  baseURL?: string;
}

// Credit: https://stackoverflow.com/a/47914643
//
// Allows consumer to apply Partial to each key in a nested interface.
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface Params {
  page?: number;
  page_size?: number;
}

export interface RequestOptions {
  filter?: Filter;
  headers?: RequestHeaders;
  params?: Params;
}

export interface FilterConditionTypes {
  '+and'?: Filter[];
  '+contains'?: string;
  '+eq'?: number | string;
  '+gt'?: number;
  '+gte'?: number;
  '+lt'?: number;
  '+lte'?: number;
  '+neq'?: string;
  '+or'?: Filter[] | string[];
  '+order'?: 'asc' | 'desc';
  '+order_by'?: string;
}

type RequestHeaderValue = boolean | null | number | string | string[];

type RequestContentType =
  | 'application/json'
  | 'application/octet-stream'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/html'
  | 'text/plain'
  | RequestHeaderValue;

export interface RequestHeaders {
  [key: string]: RequestHeaderValue | undefined;
  Accept?: string;
  Authorization?: string;
  'Content-Encoding'?: string;
  'Content-Length'?: number;
  'Content-Type'?: RequestContentType;
  'User-Agent'?: string;
}

export interface PriceType {
  id: string;
  label: string;
  price: PriceObject;
  region_prices: RegionPriceObject[];
  transfer: number;
}
