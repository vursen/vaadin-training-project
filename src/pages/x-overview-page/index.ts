import { MobxLitElement } from '@adobe/lit-mobx';
import { css, html, customElement, internalProperty } from 'lit-element';

import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';

import { store } from './store';

import './x-grid';
import './x-chart';
import './x-autocomplete';

@customElement('x-overview-page')
export class XOverviewPage extends MobxLitElement {
  @internalProperty()
  isLoading = false;

  static get styles() {
    return css`
      .wrapper {
        padding: var(--lumo-space-m);
      }

      .title {
        margin: 0 0 var(--lumo-space-l);
        font-size: var(--lumo-font-size-xl);
      }

      .chart {
        display: block;
        margin-bottom: var(--lumo-space-m);
      }
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
  }

  get isChartVisible() {
    return store.chartSeries.length > 0;
  }

  get isGridVisible() {
    return store.gridItems.length > 0;
  }

  render() {
    return html`
      <div class="wrapper">
        <x-overview-page-autocomplete></x-overview-page-autocomplete>

        <h1 class="title">Downloads</h1>

        ${this.isChartVisible
          ? html`<x-overview-page-chart class="chart"></x-overview-page-chart>`
          : html``}
        ${this.isGridVisible
          ? html`<x-overview-page-grid class="grid"></x-overview-page-grid>`
          : html``}
      </div>
    `;
  }
}
