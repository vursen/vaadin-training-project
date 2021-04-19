import { makeAutoObservable, action } from 'mobx';

import { periodStore } from '../../stores/period-store';
import { componentsStore } from '../../stores/components-store';

interface IContext {
  periodStore: typeof periodStore;
  componentsStore: typeof componentsStore;
}

export class Store {
  /**
   * The component name
   */
  componentName!: string;

  /**
   * Constructor
   */
  constructor(private context: IContext = { periodStore, componentsStore }) {
    makeAutoObservable(this, {
      fetch: action,
    });
  }

  /**
   *
   */
  async fetch(componentName: string) {
    const { componentsStore } = this.context;

    await Promise.all([
      componentsStore.fetchComponents(),
      componentsStore.fetchComponentStatistics(componentName),
    ]);

    this.componentName = componentName;
  }

  /**
   * The component
   */
  get component() {
    const { componentsStore } = this.context;

    return componentsStore.componentsMap.get(this.componentName)!;
  }

  /**
   * The component's statistics
   */
  get statistics() {
    const { componentsStore } = this.context;

    return componentsStore.statisticsMap.get(this.componentName)!;
  }

  get downloads() {
    const { periodStore } = this.context;

    return this.statistics.downloads.filter(({ date }) => {
      return periodStore.includes(date);
    });
  }

  get versions() {
    const { versions } = this.statistics.downloads[0];

    return Object.keys(versions);
  }

  /**
   * An array of the grid items
   */
  get gridItems() {
    return this.versions.map(version => {
      const dates: Record<string, number> = {};

      this.downloads.forEach(({ date, versions }) => {
        dates[date] = versions[version];
      });

      return { version, dates };
    });
  }

  /**
   * An array of the grid date columns
   */
  get gridDateColumns() {
    return this.downloads.map(({ date }) => {
      const [, month, day] = date.split('-');

      return {
        path: `dates.${date}`,
        // Format date as `dd/mm`
        header: `${day}/${month}`,
      };
    });
  }

  /**
   * An array of the chart series
   */
  get chartSeries() {
    return this.versions.map(version => {
      const values: number[] = [];

      this.downloads.forEach(({ versions }) => {
        values.push(versions[version]);
      });

      return { version, values };
    });
  }

  /**
   * An array of the chart categories
   */
  get chartCategories() {
    return this.downloads.map(({ date }) => {
      const [, month, day] = date.split('-');

      // Format date as `dd/mm`
      return `${day}/${month}`;
    });
  }
}

export const store = new Store();
