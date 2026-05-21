import { describe, expect, it } from 'vitest';

import { convertStorageUnit } from './unitConversions';

describe('conversion helper functions', () => {
  describe('convertStorageUnit', () => {
    const base = 1024;

    // Bytes
    it('should convert bytes to bytes', () => {
      expect(convertStorageUnit('B', 5 * Math.pow(base, 0), 'B')).toBe(5);
    });

    it('should convert bytes to kilobytes', () => {
      expect(convertStorageUnit('B', 5 * Math.pow(base, 1), 'KB')).toBe(5);
    });

    it('should convert bytes to megabytes', () => {
      expect(convertStorageUnit('B', 5 * Math.pow(base, 2), 'MB')).toBe(5);
    });

    it('should convert bytes to gigabytes', () => {
      expect(convertStorageUnit('B', 5 * Math.pow(base, 3), 'GB')).toBe(5);
    });

    it('should convert bytes to terabytes', () => {
      expect(convertStorageUnit('B', 5 * Math.pow(base, 4), 'TB')).toBe(5);
    });

    // Kilobytes
    it('should convert kilobytes to kilobytes', () => {
      expect(convertStorageUnit('KB', 5 * Math.pow(base, 0), 'KB')).toBe(5);
    });

    it('should convert kilobytes to meagabytes', () => {
      expect(convertStorageUnit('KB', 5 * Math.pow(base, 1), 'MB')).toBe(5);
    });

    it('should convert kilobytes to gigabytes', () => {
      expect(convertStorageUnit('KB', 5 * Math.pow(base, 2), 'GB')).toBe(5);
    });

    it('should convert kilobytes to terabytes', () => {
      expect(convertStorageUnit('KB', 5 * Math.pow(base, 3), 'TB')).toBe(5);
    });

    it('should convert kilobytes to bytes', () => {
      expect(convertStorageUnit('KB', 5, 'B')).toBe(5 * Math.pow(base, 1));
    });

    // Megabytes
    it('should convert megabytes to megabytes', () => {
      expect(convertStorageUnit('MB', 5 * Math.pow(base, 0), 'MB')).toBe(5);
    });

    it('should convert megabytes to gigabytes', () => {
      expect(convertStorageUnit('MB', 5 * Math.pow(base, 1), 'GB')).toBe(5);
    });

    it('should convert megabytes to terabytes', () => {
      expect(convertStorageUnit('MB', 5 * Math.pow(base, 2), 'TB')).toBe(5);
    });

    it('should convert megabytes to kilobytes', () => {
      expect(convertStorageUnit('MB', 5, 'KB')).toBe(5 * Math.pow(base, 1));
    });

    it('should convert megabytes to bytes', () => {
      expect(convertStorageUnit('MB', 5, 'B')).toBe(5 * Math.pow(base, 2));
    });

    // Gigabytes
    it('should convert gigabytes to gigabytes', () => {
      expect(convertStorageUnit('GB', 5 * Math.pow(base, 0), 'GB')).toBe(5);
    });

    it('should convert gigabytes to terabytes', () => {
      expect(convertStorageUnit('GB', 5 * Math.pow(base, 1), 'TB')).toBe(5);
    });

    it('should convert gigabytes to megabytes', () => {
      expect(convertStorageUnit('GB', 5, 'MB')).toBe(5 * Math.pow(base, 1));
    });

    it('should convert gigabytes to kilobytes', () => {
      expect(convertStorageUnit('GB', 5, 'KB')).toBe(5 * Math.pow(base, 2));
    });

    it('should convert gigabytes to bytes', () => {
      expect(convertStorageUnit('GB', 5, 'B')).toBe(5 * Math.pow(base, 3));
    });

    // Terabytes
    it('should convert terabytes to terabytes', () => {
      expect(convertStorageUnit('TB', 5 * Math.pow(base, 0), 'TB')).toBe(5);
    });

    it('should convert terabytes to gigabytes', () => {
      expect(convertStorageUnit('TB', 5, 'GB')).toBe(5 * Math.pow(base, 1));
    });

    it('should convert gigabytes to megabytes', () => {
      expect(convertStorageUnit('TB', 5, 'MB')).toBe(5 * Math.pow(base, 2));
    });

    it('should convert gigabytes to kilobytes', () => {
      expect(convertStorageUnit('TB', 5, 'KB')).toBe(5 * Math.pow(base, 3));
    });

    it('should convert gigabytes to bytes', () => {
      expect(convertStorageUnit('TB', 5, 'B')).toBe(5 * Math.pow(base, 4));
    });
  });
});
