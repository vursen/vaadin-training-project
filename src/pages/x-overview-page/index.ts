import { MobxLitElement } from '@adobe/lit-mobx';
import { css, html, customElement, internalProperty } from 'lit-element';

import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';

import { componentsStore } from '../../stores/components-store';

<<<<<<< HEAD
import { store } from './store';
=======
import './x-grid';

import { store } from './store';
import { runInAction, transaction } from 'mobx';
>>>>>>> Draft the overview page grid

@customElement('x-overview-page')
export class XOverviewPage extends MobxLitElement {
  @internalProperty()
  isLoading = false

  static get styles() {
    return css`
      .overview-page {
        padding: var(--lumo-space-m);
      }
    `;
  }

  async connectedCallback() {
    super.connectedCallback();

    this.isLoading = true

    // TODO: Remove as the components selector will have been implemented
    await Promise.all([
      componentsStore.fetchComponentStatistics('vaadin-button'),
      componentsStore.fetchComponentStatistics('vaadin-avatar'),
      store.setSelectedItemIds(['vaadin-button'])
    ]);

    this.isLoading = false
  }

  get items() {
    return store.items;
  }

  get hasItems() {
    if (this.isLoading) {
      return false
    }

    return this.items.length > 0;
  }

  render() {
    return html`
      <div class="overview-page">
        ${this.hasItems
          ? html`
            <x-overview-page-grid></x-overview-page-grid>
            <!-- <x-overview-page-chart></x-overview-page-chart> -->
          `
          : null
        }
      </div>
    `;
  }
}
