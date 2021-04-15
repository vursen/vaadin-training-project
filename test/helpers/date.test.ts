import sinon from 'sinon';
import { expect } from '@open-wc/testing';

import { today, formatDate, parseDate, weeksAgo } from '../../src/helpers/date';

describe('date helpers', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers(Date.parse('2021-01-15'));
  });

  afterEach(() => {
    clock.restore();
  });

  describe('formatDate', () => {
    it('should format date', () => {
      const date = new Date();

      expect(formatDate(date)).to.equal('2021-01-15');
    });
  });

  describe('parseDate', () => {
    it('should parse date', () => {
      const date = parseDate('07/07/2021').toString();
      const expectedDate = new Date('2021-07-07').toString();

      expect(date).to.equal(expectedDate);
    });
  });

  describe('today', () => {
    it(`should return the today's date`, () => {
      expect(today()).to.equal('2021-01-15');
    });
  });

  describe('weeksAgo', () => {
    it(`should substract a number of weeks from the today's date`, () => {
      expect(weeksAgo(2)).to.equal('2021-01-01');
    });
  });
});
