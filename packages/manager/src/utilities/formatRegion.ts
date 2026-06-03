import {
  getSelectedRegionGroup,
  isEURegion,
} from '@akamai/compute-ui-core/api';

import type { Region } from '@linode/api-v4';
import type { Agreements, Profile } from '@linode/api-v4';

interface GDPRConfiguration {
  /** The user's agreements */
  agreements: Agreements | undefined;
  /** The user's profile */
  profile: Profile | undefined;
  /** The list of regions */
  regions: Region[] | undefined;
  /** The ID of the selected region (e.g. 'eu-west') */
  selectedRegionId: string | undefined;
}

/**
 *
 * @returns The group of the selected region, if it exists
 * @example
 *  const { selectedRegionGroup, showGDPRCheckbox } = getGDPRDetails({
 *    agreements,
 *    profile,
 *    regions,
 *    selectedRegionId,
 * });
 */
export const getGDPRDetails = ({
  agreements,
  profile,
  regions,
  selectedRegionId,
}: GDPRConfiguration): {
  selectedRegionGroup?: string;
  showGDPRCheckbox: boolean;
} => {
  if (regions === undefined) {
    return { selectedRegionGroup: undefined, showGDPRCheckbox: false };
  }

  const selectedRegionGroup = getSelectedRegionGroup(regions, selectedRegionId);

  const showGDPRCheckbox =
    Boolean(!profile?.restricted) &&
    Boolean(!agreements?.eu_model) &&
    isEURegion(selectedRegionGroup);

  return { selectedRegionGroup, showGDPRCheckbox };
};
