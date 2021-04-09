import { MobxLitElement } from '@adobe/lit-mobx';
import { css, html, customElement, internalProperty } from 'lit-element';

import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';

import { store } from './store';

import '../../components/x-date-range';

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
        margin: 0 0 var(--lumo-space-s);
        font-size: var(--lumo-font-size-xxl);
      }

      .date-range {
        display: block;
        margin: 0 0 var(--lumo-space-m);
      }

      .autocomplete {
        display: block;
        margin: 0 0 var(--lumo-space-l);
      }

      .subtitle {
        margin: 0 0 var(--lumo-space-m);
        font-size: var(--lumo-font-size-l);
      }

      .chart {
        display: block;
        margin-bottom: var(--lumo-space-m);
      }
    `;
  }

  get isDownloadsVisible() {
    return store.gridItems.length > 0;
  }

  render() {
    return html`
      <div class="wrapper">
        <h1 class="title">Overview</h1>

        <x-date-range class="date-range"></x-date-range>

        <x-overview-page-autocomplete
          class="autocomplete"
        ></x-overview-page-autocomplete>

        ${this.isDownloadsVisible
          ? html`
              <h2 class="subtitle">Downloads</h2>
              <x-overview-page-chart class="chart"></x-overview-page-chart>
              <x-overview-page-grid class="grid"></x-overview-page-grid>
            `
          : html``}
      </div>
    `;
  }
}
