import { MobxLitElement } from '@adobe/lit-mobx';
import { css, html, customElement, internalProperty } from 'lit-element';

import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';

import { componentsStore } from '../../stores/components-store';

import { store } from './store';

import './x-grid';
import './x-chart';

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

    this.isLoading = true;

    // TODO: Remove as the components autocomplete will be implemented
    await Promise.all([
      componentsStore.fetchComponentStatistics('vaadin-button'),
      componentsStore.fetchComponentStatistics('vaadin-avatar'),
    ]);

    this.isLoading = false;
  }

  get items() {
    return store.items;
  }

  get hasItems() {
    if (this.isLoading) {
      return false;
    }

    return this.items.length > 0;
  }

  render() {
    return html`
      <div class="wrapper">
        <h1 class="title">Downloads</h1>

        ${this.hasItems
          ? html`
              <x-overview-page-chart class="chart"></x-overview-page-chart>
              <x-overview-page-grid class="grid"></x-overview-page-grid>
            `
          : null}
      </div>
    `;
  }
}
