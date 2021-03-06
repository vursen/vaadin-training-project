import { makeAutoObservable, runInAction } from 'mobx';

import { parseDate, formatDate } from '../helpers/date';

import { api } from '../api';

export interface IComponent {
  name: string;
  npmName: string;
  version: string;
}

export interface IComponentStatistics {
  name: string;
  downloads: IComponentStatisticsDownloads[];
}

export interface IComponentStatisticsDownloads {
  date: string;
  total: number;
  versions: Record<string, number>;
}

export interface IContext {
  api: typeof api;
}

export class ComponentsStore {
  /**
   * The components as a map where the key is a component name
   */
  componentsMap = new Map<IComponent['name'], IComponent>();

  /**
   * The components promise
   */
  componentsPromise: Promise<void> | null = null;

  /**
   * The statistics of components as a map where the key is a component name
   */
  statisticsMap = new Map<IComponentStatistics['name'], IComponentStatistics>();

  /**
   * Constructor
   */
  constructor(private context: IContext = { api }) {
    makeAutoObservable(this);
  }

  /**
   * The components as an array
   */
  get components() {
    return [...this.componentsMap.values()];
  }

  /**
   * The statistics of components as an array
   */
  get statistics() {
    return [...this.statisticsMap.values()];
  }

  /**
   * Fetches components using API and puts into the state
   */
  fetchComponents() {
    if (this.componentsPromise) return this.componentsPromise;

    this.componentsPromise = this._fetchComponents();

    return this.componentsPromise;
  }

  private async _fetchComponents() {
    const { api } = this.context;

    const { core } = await api.fetchComponents();

    runInAction(() => {
      this.componentsMap.clear();

      Object.entries(core)
        .filter(([_name, { component }]) => component)
        .forEach(([name, component]) => {
          this.componentsMap.set(name, {
            name,
            npmName: component.npmName!,
            version: component.jsVersion!,
          });
        });
    });
  }

  /**
   * Fetches the component statistics using API,
   * aggregates the total of downloads by weeks and puts the result into the state
   */
  async fetchComponentStatistics(name: string) {
    const { api } = this.context;

    const statistics = await api.fetchComponentStatistics(name);

    runInAction(() => {
      const downloads = statistics.downloads.map(({ date, ...versions }) => {
        // Aggregates the total of downloads over the week
        const total = Object.values(versions).reduce(
          (sum, count) => sum + count,
          0
        );

        // Parses an original date that comes up in the `dd/mm/yyyy` date format
        const parsedDate = parseDate(date);
        // Stores the parsed date in ISO format
        const parsedDateISO = formatDate(parsedDate);

        return {
          date: parsedDateISO,
          total,
          versions,
        };
      });

      this.statisticsMap.set(name, {
        name,
        downloads,
      });
    });
  }
}

export const componentsStore = new ComponentsStore();
