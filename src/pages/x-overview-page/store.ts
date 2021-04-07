import { makeAutoObservable } from 'mobx';

import { componentsStore } from '../../stores/components-store'

interface IContext {
  componentsStore: typeof componentsStore
}

export class Store {
  /**
   * Custom period
   */
  customPeriod = null

  /**
   * Constructor
   */
  constructor (
    private context: IContext = { componentsStore }
  ) {
    makeAutoObservable(this)
  }

  /**
   * Aggregates the totals over the entire period, the last week, the custom period
   * and returns the result as a list that can be later used in `<vaadin-grid />`
   */
  get items () {
    const { componentsStore } = this.context

    return [...componentsStore.statistics.values()]
      .map(({ name, downloads }) => {
        // Aggregates the total of downloads over weeks
        const total = downloads.reduce((sum, { total }) => sum + total, 0)

        // Aggregates the total of downloads over the last week
        const totalOverWeek = downloads[0].total

        // Aggregates the total of downloads over the custom period
        const totalOverCustomPeriod = downloads
          // .filter(({ date }) => {
          //   date
          // })
          .reduce((sum, { total }) => sum + total, 0)

        return {
          name,
          total,
          totalOverWeek,
          totalOverCustomPeriod
        }
      })
  }
}

export const store = new Store()
