import { makeAutoObservable, action } from 'mobx';

import { today, weeksAgo } from '../helpers/date';

const DELIMITER = '|';

export class PeriodStore {
  /**
   * The period that is represented as a date range in ISO format
   * with taking `|` as a date range delimiter.
   */
  period = '';

  /**
   * Constructor
   */
  constructor() {
    makeAutoObservable(this, {
      setPeriod: action,
    });
  }

  /**
   * The start date of the period
   */
  get startDate() {
    return this.period.split(DELIMITER)[0] ?? '';
  }

  /**
   * The end date of the period
   */
  get endDate() {
    return this.period.split(DELIMITER)[1] ?? '';
  }

  /**
   * Pre-defined periods
   */
  get periods() {
    return [
      { title: 'Last 2 weeks', value: [weeksAgo(2), today()].join(DELIMITER) },
      { title: 'Last 4 weeks', value: [weeksAgo(4), today()].join(DELIMITER) },
    ];
  }

  /**
   * Replaces the period with the new one
   */
  setPeriod(period: PeriodStore['period']) {
    this.period = period;
  }

  /**
   * Returns true if the period contains the given date and false otherwise
   */
  includes(date: string) {
    if (this.period === '') return true;

    return (
      new Date(date) >= new Date(this.startDate) &&
      new Date(date) <= new Date(this.endDate)
    );
  }
}

export const periodStore = new PeriodStore();
