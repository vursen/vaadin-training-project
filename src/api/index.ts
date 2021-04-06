export interface IApiComponents {
  core: Record<
    string,
    {
      pro?: boolean;
      npmName?: string;
      npmVersion?: string;
      component?: boolean;
      components?: string[];
      jsVersion?: string;
      javaVersion?: string;
    }
  >;
  vaadin: Record<
    string,
    {
      pro?: boolean;
      npmName?: string;
      npmVersion?: string;
      component?: boolean;
      components?: string[];
      jsVersion?: string;
      javaVersion?: string;
    }
  >;
}

export interface IApiComponentStatistics {
  downloads: IApiComponentStatisticsDownloads[];
}

export interface IApiComponentStatisticsDownloads {
  date: string;
  // TODO: Look for a workaround to get rid of the `any` type
  [k: string]: any;
}

export class Api {
  /**
   * Fetches available components
   */
  fetchComponents(): Promise<IApiComponents> {
    return this.fetch(
      'https://raw.githubusercontent.com/vaadin/platform/master/versions.json'
    );
  }

  /**
   * Fetches the component statistics such as statistics of downloads
   */
  fetchComponentStatistics(name: string): Promise<IApiComponentStatistics> {
    return this.fetch(
      `https://web-padawan.github.io/npm-downloads/${name}.json`
    );
  }

  private async fetch(url: string) {
    const response = await fetch(url);

    return response.json();
  }
}

export const api = new Api();
