import { DEFAULT_ERROR_MESSAGE } from 'src/constants';

import { getAPIErrorOrDefault } from './errorUtils';

describe('Error handling utilities', () => {
  describe('getAPIErrorOrDefault', () => {
    it('should override a default error', () => {
      expect(
        getAPIErrorOrDefault(
          [{ reason: DEFAULT_ERROR_MESSAGE }],
          'New error message'
        )
      ).toEqual([{ reason: 'New error message' }]);
    });
  });
});
