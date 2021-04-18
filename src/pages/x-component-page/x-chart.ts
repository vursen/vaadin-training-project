import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, query } from 'lit-element';

import '@vaadin/vaadin-charts';
import { ChartElement } from '@vaadin/vaadin-charts';

import { store } from './store';

@customElement('x-component-page-chart')
export class XComponentPageChart extends MobxLitElement {
  @query('#chart')
  chart!: ChartElement;

  renderSeries() {
    return (
      store.chartSeries
        // TODO: Temporarily
        .slice(0, 5)
        .map(
          ({ version, values }) => html`
            <vaadin-chart-series
              unit="Downloads"
              .title="${version}"
              .values="${values}"
            ></vaadin-chart-series>
          `
        )
    );
  }

  render() {
    return html`
      <div class="wrapper">
        <vaadin-chart
          id="chart"
          type="area"
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
