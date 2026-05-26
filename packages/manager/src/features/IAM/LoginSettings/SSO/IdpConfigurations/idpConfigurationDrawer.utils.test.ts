import {
  getCertificateStatus,
  truncateCertificate,
} from './idpConfigurationDrawer.utils';

describe('IDP Configuration Drawer Utils', () => {
  describe('getCertificateStatus', () => {
    it('returns "error" if the certificate is expired', () => {
      const expiredDate = new Date(
        Date.now() - 1000 * 60 * 60 * 24
      ).toISOString();
      expect(getCertificateStatus(expiredDate)).toBe('error');
    });

    it('returns "other" if the certificate expires within 90 days', () => {
      const soonDate = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30
      ).toISOString();
      expect(getCertificateStatus(soonDate)).toBe('other');
    });

    it('returns "active" if the certificate expires in more than 90 days', () => {
      const futureDate = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 120
      ).toISOString();
      expect(getCertificateStatus(futureDate)).toBe('active');
    });
  });

  describe('truncateCertificate', () => {
    it('returns the original string if <= 30 chars', () => {
      const cert = 'short-certificate-string';
      expect(truncateCertificate(cert)).toBe(cert);
    });

    it('truncates and formats long certificates', () => {
      const cert = '1234567890abcdefghijABCDEFGHIJ1234567890';
      expect(truncateCertificate(cert)).toBe('1234567890 ... 1234567890');
    });
  });
});
