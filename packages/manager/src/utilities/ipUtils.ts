import type { PrefixListRuleReference } from 'src/features/Firewalls/shared';

export interface ExtendedIP {
  address: string;
  error?: string;
}

export interface ExtendedPL extends ExtendedIP, PrefixListRuleReference {}