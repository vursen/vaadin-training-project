import { api } from '../api/index.js'

export interface IStateComponent {
  name: string,
  npmName: string,
  version: string,
}

export interface IStateComponentStatistics {
  name: string,
  downloads: Array<{
    date: string,
    versions: Record<string, number>
  }>
}

export class ComponentsStore {
  /**
   * Keeps the components as a map to access by component name
   */
  components = new Map<
    IStateComponent['name'],
    IStateComponent
  >()

  /**
   * Keeps the statistics of components as a map to access by component name
   */
  statistics = new Map<
    IStateComponentStatistics['name'],
    IStateComponentStatistics
  >()

  /**
   * Loads components using API into the state
   */
  async fetchComponents () {
    const { core } = await api.fetchComponents()

    this.components.clear()

    Object.entries(core)
      .filter(([_name, { component }]) => component)
      .forEach(([name, component]) => {
        this.components.set(name, {
          name,
          npmName: component.npmName!,
          version: component.jsVersion!
        })
      })
  }

  /**
   * Loads the component statistics using API into the state
   */
  async fetchComponentStatistics (name: string) {
    const { downloads } = await api.fetchComponentStatistics(name)

    this.statistics.set(name, {
      name,
      downloads: downloads.map(({ date, ...versions }) => {
        return {
          date,
          versions
        }
      })
    })
  }
}

export const componentsStore = new ComponentsStore()
