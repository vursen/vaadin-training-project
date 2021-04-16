import { action, makeAutoObservable } from 'mobx';

import { componentsStore } from '../../stores/components-store';
import { periodStore } from '../../stores/period-store';

interface IContext {
  periodStore: typeof periodStore;
  componentsStore: typeof componentsStore;
}

export interface IGridItem {
  name: string;
  npmName: string;
  total: number;
  totalOverWeek: number;
  totalOverPeriod: number;
}

export interface IChartItem {
  name: string;
  weeks: Array<{ date: string; total: number }>;
}

export class Store {
  /**
   * The names of the selected grid items as a set
   */
  selectedGridItemNames = new Set<IGridItem['name']>();

  /**
   * Constructor
   */
  constructor(private context: IContext = { periodStore, componentsStore }) {
    makeAutoObservable(this, {
      selectGridItem: action,
      setSelectedGridItems: action,
    });
  }

  /**
   * Replaces selected grid item names with the new ones
   */
  setSelectedGridItems(names: Array<IGridItem['name']>) {
    this.selectedGridItemNames = new Set(names);
  }

  /**
   * Selects the grid item
   */
  selectGridItem(name: IGridItem['name']) {
    this.selectedGridItemNames.add(name);
  }

  /**
   * Returns true if the grid item is selected and false otherwise
   */
  isGridItemSelected(name: IGridItem['name']) {
    return this.selectedGridItemNames.has(name);
  }

  /**
   * An array of the grid items based on
   * the components' statistics aggregating some totals.
   */
  get gridItems(): IGridItem[] {
    const { componentsStore, periodStore } = this.context;

    return componentsStore.statistics.map(({ name, downloads: weeks }) => {
      const { npmName } = componentsStore.componentsMap.get(name)!;

      // Aggregates the downloads over weeks
      const total = weeks.reduce((sum, { total }) => sum + total, 0);

      // Aggregates the downloads over the last week
      const totalOverWeek = weeks[weeks.length - 1].total;

      // Aggregates the downloads over the custom period
      const totalOverPeriod = weeks
        .filter(({ date }) => {
          return periodStore.includes(date);
        })
        .reduce((sum, { total }) => sum + total, 0);

      return {
        name,
        npmName,
        total,
        totalOverWeek,
        totalOverPeriod,
      };
    });
  }

  /**
   * An array of the selected grid items
   */
  get selectedGridItems() {
    return this.gridItems.filter(({ name }) => this.isGridItemSelected(name));
  }

  /**
   * An array of the chart items based on the components' statistics
   */
  get chartItems(): IChartItem[] {
    const { componentsStore } = this.context;

    return componentsStore.statistics
      .map(({ name, downloads: weeks }) => {
        return {
          name,
          weeks,
        };
      })
      .filter(({ name }) => {
        return this.isGridItemSelected(name);
      });
  }

  /**
   * An array of the chart series
   */
  get chartSeries() {
    return this.chartItems.map(({ name, weeks }) => {
      return {
        title: name,
        values: weeks.map(({ total }) => total),
      };
    });
  }

  /**
   * An array of the chart categories
   */
  get chartCategories() {
    return this.chartItems[0]?.weeks.map(({ date }) => {
      const [, month, day] = date.split('-');

      // Format date as `dd/mm`
      return `${day}/${month}`;
    });
  }
}

export const store = new Store();
