import sinon from 'sinon';
import { expect } from '@open-wc/testing';

import {
  today,
  format,
  weeksAgo,
  serializeDateRange,
  deserializeDateRange,
} from '../../../src/components/x-date-range-picker/helpers';

describe('x-date-range-picker helpers', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2021-01-15').getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  describe('format', () => {
    it('should format date', () => {
      const date = new Date();

      expect(format(date)).to.equal('2021-01-15');
    });
  });

  describe('today', () => {
    it(`should return the today's date`, () => {
      expect(today()).to.equal('2021-01-15');
    });
  });

  describe('weeksAgo', () => {
    it(`should substract a number of weeks ago from the today's date`, () => {
      expect(weeksAgo(2)).to.equal('2021-01-01');
    });
  });

  describe('serializeDateRange', () => {
    it('should serialize a date range', () => {
      const range = [weeksAgo(2), today()];
      const expectedRange = '2021-01-01|2021-01-15';

      expect(serializeDateRange(range, '|')).to.equal(expectedRange);
    });
  });

  describe('deserializeDateRange', () => {
    it('should deserialize a date range', () => {
      const range = '2021-01-01|2021-01-15';
      const expectedRange = [weeksAgo(2), today()];

      expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
    });

    it('should deserialize an empty date range', () => {
      const range = '';
      const expectedRange = ['', ''];

      expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
    });

    it('should deserialize a date range with only a start date', () => {
      const range = '2021-01-01|';
      const expectedRange = ['2021-01-01', ''];

      expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
    });

    it('should deserialize a date range with only an end date', () => {
      const range = '|2021-01-01';
      const expectedRange = ['', '2021-01-01'];

      expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
    });
  });
});
