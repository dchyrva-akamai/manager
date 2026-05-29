import { PRIVATE_IPV4_REGEX } from '@linode/validation';

import type { PrefixListRuleReference } from 'src/features/Firewalls/shared';

/**
 * Determines if an IPv4 address is private
 * @returns true if the given IPv4 address is private
 */
export const isPrivateIP = (ip: string) => {
  return PRIVATE_IPV4_REGEX.test(ip);
};

export interface ExtendedIP {
  address: string;
  error?: string;
}

export interface ExtendedPL extends ExtendedIP, PrefixListRuleReference {}
