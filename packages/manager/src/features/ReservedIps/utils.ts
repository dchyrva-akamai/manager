import { useFlags } from 'src/hooks/useFlags';

import type { IPAddress } from '@linode/api-v4';

/**
 *
 * @returns an object that contains boolean property to check whether Reserved IP is enabled or not
 */
export const useIsReserveIpEnabled = () => {
  const flags = useFlags();

  // @TODO ReservedIps: check for customer tag/account capability when it exists

  return { isReserveIpEnabled: flags.reserveIp ?? false };
};

/**
 * Generates a description for a Reserved IP based on its assigned entity.
 *
 * @param reservedIp - The Reserved IP address object
 * @returns A descriptive string indicating the assignment status
 */
export const getReservedIPDescription = (reservedIp: IPAddress): string => {
  if (!reservedIp.assigned_entity?.type) {
    return 'Unassigned';
  }

  const { label, type } = reservedIp.assigned_entity;

  if ((type === 'linode' || type === 'nodebalancer') && label) {
    return `Assigned to ${label}`;
  }

  return `Assigned to ${label || type}`;
};
