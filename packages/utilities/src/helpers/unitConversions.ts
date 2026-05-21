export type StorageSymbol = 'byte' | 'bytes' | 'GB' | 'KB' | 'MB' | 'TB';

export enum StorageUnitExponents {
  B = 0,
  GB = 3,
  KB = 1,
  MB = 2,
  TB = 4,
}

type StorageUnitExponentKey = keyof typeof StorageUnitExponents;

/**
 * Converts from one storage unit to another.
 *
 * @param sourceUnit - The storage unit to convert the quantity from
 * @param sourceQuantity - The quantity to covert
 * @param targetUnit - The storage unit to convert the quantity to
 */
export const convertStorageUnit = (
  sourceUnit: StorageUnitExponentKey,
  sourceQuantity: number | undefined,
  targetUnit: StorageUnitExponentKey,
) => {
  if (sourceQuantity === undefined) {
    return 0;
  }

  if (sourceUnit === targetUnit) {
    return sourceQuantity;
  }

  const BASE = 1024;

  const exponent =
    StorageUnitExponents[sourceUnit] - StorageUnitExponents[targetUnit];
  return sourceQuantity * Math.pow(BASE, exponent);
};
