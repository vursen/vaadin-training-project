import sinon from 'sinon';
import { expect } from '@open-wc/testing';

import {
  serializeDateRange,
  deserializeDateRange,
} from '../../../src/components/x-date-range-picker/helpers';

describe('x-date-range-picker helpers', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers(Date.parse('2021-01-15'));
  });

  afterEach(() => {
    clock.restore();
  });

  describe('serializeDateRange', () => {
    it('should serialize a date range', () => {
      const range = ['2021-01-01', '2021-01-15'];
      const expectedRange = '2021-01-01|2021-01-15';

      expect(serializeDateRange(range, '|')).to.equal(expectedRange);
    });
  });

  describe('deserializeDateRange', () => {
    it('should deserialize a date range', () => {
      const range = '2021-01-01|2021-01-15';
      const expectedRange = ['2021-01-01', '2021-01-15'];

      expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
    });

    it('should deserialize an empty date range', () => {
      const range = '';
      const expectedRange = ['', ''];

      expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
    });

    it('should deserialize a date range that defines only a start date', () => {
      const range = '2021-01-01|';
      const expectedRange = ['2021-01-01', ''];

      expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
    });

    it('should deserialize a date range that defines only an end date', () => {
      const range = '|2021-01-01';
      const expectedRange = ['', '2021-01-01'];

      expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
    });
  });
});
