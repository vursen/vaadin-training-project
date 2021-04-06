import { makeAutoObservable, runInAction } from 'mobx';

import { api } from '../api/index.js';

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
  versions: Record<string, number>;
}

export class ComponentsStore {
  /**
   * Keeps the components as a map where the key is a component name
   */
  components = new Map<IComponent['name'], IComponent>();

  /**
   * Keeps the statistics of components as a map where the key is a component name
   */
  statistics = new Map<IComponentStatistics['name'], IComponentStatistics>();

  /**
   * Constructor
   */
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Fetches components using API and puts the result into the state
   */
  async fetchComponents() {
    const { core } = await api.fetchComponents();

    runInAction(() => {
      this.components.clear();

      Object.entries(core)
        .filter(([_name, { component }]) => component)
        .forEach(([name, component]) => {
          this.components.set(name, {
            name,
            npmName: component.npmName!,
            version: component.jsVersion!,
          });
        });
    });
  }

  /**
   * Fetches the component statistics using API and puts the result into the state
   */
  async fetchComponentStatistics(name: string) {
    const { downloads } = await api.fetchComponentStatistics(name);

    runInAction(() => {
      this.statistics.set(name, {
        name,
        downloads: downloads.map(({ date, ...versions }) => {
          return {
            date,
            versions,
          };
        }),
      });
    });
  }
}

export const componentsStore = new ComponentsStore();
