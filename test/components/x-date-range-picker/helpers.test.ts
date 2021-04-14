import sinon from 'sinon';
import { expect } from '@open-wc/testing';

import {
  today,
  format,
  weeksAgo,
  serializeDateRange,
  deserializeDateRange,
} from '../../../src/components/x-date-range-picker/helpers';

describe('<x-date-range-picker /> helpers', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2021-01-15').getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it('should format date', () => {
    const date = new Date();

    expect(format(date)).to.equal('2021-01-15');
  });

  it(`should return the today's date`, () => {
    expect(today()).to.equal('2021-01-15');
  });

  it(`should substract a number of weeks ago from the today's date`, () => {
    expect(weeksAgo(2)).to.equal('2021-01-01');
  });

  it('should serialize date range', () => {
    const range = [weeksAgo(2), today()];
    const expectedRange = '2021-01-01|2021-01-15';

    expect(serializeDateRange(range, '|')).to.equal(expectedRange);
  });

  it('should deserialize date range', () => {
    const range = '2021-01-01|2021-01-15';
    const expectedRange = [weeksAgo(2), today()];

    expect(deserializeDateRange(range, '|')).to.deep.equal(expectedRange);
  });
});
