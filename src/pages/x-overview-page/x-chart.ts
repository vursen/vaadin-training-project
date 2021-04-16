import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, query } from 'lit-element';

import '@vaadin/vaadin-charts';
import { ChartElement } from '@vaadin/vaadin-charts';

import { store } from './store';

@customElement('x-overview-page-chart')
export class XOverviewPageChartElement extends MobxLitElement {
  @query('#chart')
  chart!: ChartElement;

  renderSeries() {
    return store.chartSeries.map(
      ({ title, values }) => html`
        <vaadin-chart-series
          unit="Downloads"
          .title="${title}"
          .values="${values}"
        ></vaadin-chart-series>
      `
    );
  }

  render() {
    return html`
      <div class="wrapper">
        <vaadin-chart
          id="chart"
          tooltip
          no-legend
          .categories="${store.chartCategories}"
        >
          ${this.renderSeries()}
        </vaadin-chart>
      </div>
    `;
  }
}
