import { makeAutoObservable, action } from 'mobx';

import { today, weeksAgo } from '../helpers/date';

const DELIMITER = '|';

export class ReferencePeriodStore {
  /**
   * The reference period that is represented as a date range in ISO format
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
   * The start date of the reference period
   */
  get startDate() {
    return new Date(this.period.split(DELIMITER)[0] ?? '');
  }

  /**
   * The end date of the reference period
   */
  get endDate() {
    return new Date(this.period.split(DELIMITER)[1] ?? '');
  }

  /**
   * Pre-defined reference periods
   */
  get periods() {
    return [
      { title: 'Last 2 weeks', value: [today(), weeksAgo(2)].join(DELIMITER) },
      { title: 'Last 4 weeks', value: [today(), weeksAgo(4)].join(DELIMITER) },
    ];
  }

  /**
   * Replaces the reference period with the new one
   */
  setPeriod(period: ReferencePeriodStore['period']) {
    this.period = period;
  }

  /**
   * Returns true if the reference period contains the given date,
   * otherwise false
   */
  contains(date: string) {
    const parsedDate = new Date(date);

    return parsedDate >= this.startDate && parsedDate <= this.endDate;
  }
}

export const referencePeriodStore = new ReferencePeriodStore();
