import { action, makeAutoObservable } from 'mobx';

import { componentsStore } from '../../stores/components-store';

interface IContext {
  componentsStore: typeof componentsStore;
}

export interface IItem {
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
  selectedItemIds = new Set<IItem['id']>();

  /**
   * Constructor
   */
  constructor(private context: IContext = { componentsStore }) {
    makeAutoObservable(this, {
      setSelectedItemIds: action,
    });
  }

  /**
   * Replaces the ids of the selected items with the new ones
   */
  setSelectedItemIds(selectedItemIds: IItem['id'][]) {
    this.selectedItemIds = new Set(selectedItemIds);
  }

  /**
   * Aggregates the totals over the entire period, the last week, the custom period
   * and returns the result as a list that can be later used in `<vaadin-grid />`
   */
  get items(): IItem[] {
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
   * Returns only the selected items
   */
  get selectedItems(): IItem[] {
    return this.items.filter(({ id }) => this.selectedItemIds.has(id));
  }

  /**
   * Returns the series for the downloads chart
   */
  get chartSeries() {
    return this.selectedItems.map(({ name, weeks }) => {
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
    return this.selectedItems[0]?.weeks.map(({ date }) => {
      const [day, month] = date.split('/');

      // Format date as `dd/mm`
      return `${day}/${month}`;
    });
  }
}

export const store = new Store();
