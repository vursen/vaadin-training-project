import { action, makeAutoObservable } from 'mobx';

import { componentsStore } from '../../stores/components-store';
import { periodStore } from '../../stores/period-store';

interface IContext {
  periodStore: typeof periodStore;
  componentsStore: typeof componentsStore;
}

export interface IGridItem {
  id: string;
  name: string;
  npmName: string;
  weeks: Array<{ date: string; total: number }>;
  total: number;
  totalOverWeek: number;
  totalOverPeriod: number;
}

export class Store {
  /**
   * The ids of the selected items as a set
   */
  selectedGridItemIds = new Set<IGridItem['id']>();

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
   * An array of components' statistics obtained by aggregating the component's downloads
   * over some periods. Could be later used within `<vaadin-grid />`
   */
  get gridItems(): IGridItem[] {
    const { componentsStore, periodStore } = this.context;

    return [...componentsStore.statistics.values()].map(
      ({ name, downloads: weeks }) => {
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
          id: name,
          name,
          npmName,
          weeks,
          total,
          totalOverWeek,
          totalOverPeriod,
        };
      }
    );
  }

  /**
   * Only the selected grid items
   */
  get selectedGridItems(): IGridItem[] {
    return this.gridItems.filter(({ id }) => this.isGridItemSelected(id));
  }

  /**
   * The series for the downloads chart
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
   * The categories for the downloads chart
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
