import { makeAutoObservable } from 'mobx';

import { componentsStore } from '../../stores/components-store';

interface IContext {
  componentsStore: typeof componentsStore;
}

export interface IItem {
  id: string;
  name: string;
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
    makeAutoObservable(this);
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
      ({ name, downloads }) => {
        // Aggregates the total of downloads over weeks
        const total = downloads.reduce((sum, { total }) => sum + total, 0);

        // Aggregates the total of downloads over the last week
        const totalOverWeek = downloads[downloads.length - 1].total;

        // Aggregates the total of downloads over the custom period
        const totalOverCustomPeriod = downloads
          // .filter(({ date }) => {
          //   date
          // })
          .reduce((sum, { total }) => sum + total, 0);

        return {
          id: name,
          name,
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
}

export const store = new Store();
