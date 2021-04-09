import { action, makeAutoObservable } from 'mobx';

import { componentsStore } from '../../stores/components-store';

interface IContext {
  componentsStore: typeof componentsStore;
}

export interface IGridItem {
  id: string;
  name: string;
  npmName: string;
  weeks: Array<{ date: string; total: number }>;
  total: number;
  totalOverWeek: number;
  totalOverCustomPeriod: number;
}

export class Store {
  /**
   * Keeps the custom period
   */
  customPeriod = null;

  /**
   * Keeps the ids of the selected items as a set
   */
  selectedGridItemIds = new Set<IGridItem['id']>();

  /**
   * Constructor
   */
  constructor(private context: IContext = { componentsStore }) {
    makeAutoObservable(this, {
      selectGridItem: action,
      setSelectedGridItems: action,
    });
  }

  /**
   * Replaces selected grid item ids with the new ones
   */
  setSelectedGridItems(ids: Array<IGridItem['id']>) {
    this.selectedGridItemIds = new Set(ids);
  }

  /**
   * Selects the grid item
   */
  selectGridItem(id: IGridItem['id']) {
    this.selectedGridItemIds.add(id);
  }

  /**
   * Returns true if the grid item is selected and false otherwise
   */
  isGridItemSelected(id: IGridItem['id']) {
    return this.selectedGridItemIds.has(id);
  }

  /**
   * Takes the statistics of components, aggregates the totals over the entire period,
   * the last week, the custom period and returns the result as a list
   * that can be later used in `<vaadin-grid />`
   */
  get gridItems(): IGridItem[] {
    const { componentsStore } = this.context;

    return [...componentsStore.statistics.values()].map(
      ({ name, downloads: weeks }) => {
        const { npmName } = componentsStore.componentsMap.get(name)!;

        // Aggregates the total of downloads over weeks
        const total = weeks.reduce((sum, { total }) => sum + total, 0);

        // Aggregates the total of downloads over the last week
        const totalOverWeek = weeks[weeks.length - 1].total;

        // Aggregates the total of downloads over the custom period
        const totalOverCustomPeriod = weeks
          // .filter(({ date }) => {
          //   date
          // })
          .reduce((sum, { total }) => sum + total, 0);

        return {
          id: name,
          name,
          npmName,
          weeks,
          total,
          totalOverWeek,
          totalOverCustomPeriod,
        };
      }
    );
  }

  /**
   * Returns only the selected grid items
   */
  get selectedGridItems(): IGridItem[] {
    return this.gridItems.filter(({ id }) => this.isGridItemSelected(id));
  }

  /**
   * Returns the series for the downloads chart
   */
  get chartSeries() {
    return this.selectedGridItems.map(({ name, weeks }) => {
      return {
        title: name,
        values: weeks.map(({ total }) => total),
      };
    });
  }

  /**
   * Returns the categories for the downloads chart
   */
  get chartCategories() {
    return this.selectedGridItems[0]?.weeks.map(({ date }) => {
      const [day, month] = date.split('/');

      // Format date as `dd/mm`
      return `${day}/${month}`;
    });
  }
}

export const store = new Store();
