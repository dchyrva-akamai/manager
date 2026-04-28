import { renderHook, waitFor } from '@testing-library/react';

import { wrapWithTheme } from 'src/utilities/testHelpers';

import { getReservedIPDescription, useIsReserveIpEnabled } from './utils';

import type { IPAddress } from '@linode/api-v4';

describe('useIsReserveIpEnabled', () => {
  it('returns true if the feature is enabled', async () => {
    const options = { flags: { reserveIp: true } };

    const { result } = renderHook(() => useIsReserveIpEnabled(), {
      wrapper: (ui) => wrapWithTheme(ui, options),
    });

    await waitFor(() => {
      expect(result.current.isReserveIpEnabled).toBe(true);
    });
  });

  it('returns false if the feature is NOT enabled', async () => {
    const options = { flags: { reserveIp: false } };

    const { result } = renderHook(() => useIsReserveIpEnabled(), {
      wrapper: (ui) => wrapWithTheme(ui, options),
    });

    await waitFor(() => {
      expect(result.current.isReserveIpEnabled).toBe(false);
    });
  });
});

describe('getReservedIPDescription', () => {
  it('returns "Unassigned" when no entity is assigned', () => {
    const reservedIp: Partial<IPAddress> = {
      address: '192.0.2.1',
      assigned_entity: null,
    };

    expect(getReservedIPDescription(reservedIp as IPAddress)).toBe(
      'Unassigned'
    );
  });

  it('returns "Assigned to {label}" when assigned to a Linode', () => {
    const reservedIp: Partial<IPAddress> = {
      address: '192.0.2.1',
      assigned_entity: {
        label: 'my-linode',
        type: 'linode',
        id: 123,
        url: '/v4/linode/instances/123',
      },
    };

    expect(getReservedIPDescription(reservedIp as IPAddress)).toBe(
      'Assigned to my-linode'
    );
  });

  it('returns "Assigned to {label}" when assigned to a non-Linode entity without label', () => {
    const reservedIp: Partial<IPAddress> = {
      address: '192.0.2.1',
      assigned_entity: {
        label: 'my-nodebalancer',
        type: 'nodebalancer',
        id: 456,
        url: '/v4/nodebalancers/456',
      } as any,
    };

    expect(getReservedIPDescription(reservedIp as IPAddress)).toBe(
      'Assigned to my-nodebalancer'
    );
  });

  it('returns "Assigned to {type}" when assigned to an entity without label', () => {
    const reservedIp: Partial<IPAddress> = {
      address: '192.0.2.1',
      assigned_entity: {
        label: '',
        type: 'linode',
        id: 123,
        url: '/v4/linode/instances/123',
      },
    };

    expect(getReservedIPDescription(reservedIp as IPAddress)).toBe(
      'Assigned to linode'
    );
  });
});
