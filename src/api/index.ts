export interface IApiComponents {
  core: Record<string, {
    npmName?: string,
    npmVersion?: string,
    component?: boolean,
    jsVersion?: string,
    javaVersion?: string
  }>,
  vaadin: Record<string, {
    npmName?: string,
    npmVersion?: string,
    component?: boolean,
    jsVersion?: string,
    javaVersion?: string
  }>
}

export interface IApiComponent {
  downloads: Array<{
    date: string
  } & {
    [k: string]: number
  }>
}

export class Api {
  /**
   * Fetches all the list of components
   */
  fetchComponents (): Promise<IApiComponents> {
    return this.fetch('https://raw.githubusercontent.com/vaadin/platform/master/versions.json')
  }

  /**
   * Fetches a detailed information about the component, including statistics of versions' downloads
   */
  fetchComponent (name: string): Promise<IApiComponent> {
    return this.fetch(`https://github.com/web-padawan/npm-downloads/blob/master/docs/${name}.json`)
  }

  // eslint-disable-next-line class-methods-use-this
  private async fetch (url: string) {
    const response = await fetch(url)

    return response.json()
  }
}

export const api = new Api()
