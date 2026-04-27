/**
 * Converts an expiry date in MM/YYYY to MM/YY.
 * @param expiry expiry date in form <mm/yyyy> or <mm/yy>
 * @returns that same expiry date in form <mm/yy>
 */
export const formatExpiry = (expiry: string): string => {
  const expiryData = expiry.split('/');
  return expiryData[1].length > 2
    ? `${expiryData[0]}/${expiryData[1].slice(-2)}`
    : expiry;
};
