import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, query } from 'lit-element';

import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';

import { GridSelectedItemsChanged, GridElement } from '@vaadin/vaadin-grid';

import { store, Store } from './store';

@customElement('x-overview-page-grid')
export class XOverviewPageGrid extends MobxLitElement {
  @query('#grid')
  grid!: GridElement;

  onSelectedItemsChanged(_event: GridSelectedItemsChanged) {
    // TODO: Use `event.detail.value` instead of `this.grid.selectedItems`
    // as soon as https://github.com/vaadin/web-components/issues/197 will be resolved
    const selectedItems = this.grid.selectedItems as Store['selectedItems'];
    const selectedItemIds = selectedItems.map(({ id }) => id);

    store.setSelectedItemIds(selectedItemIds);
  }

  render() {
    return html`
      <div class="overview-page-grid">
        <vaadin-grid
          id="grid"
          .items="${store.items}"
          @selected-items-changed="${this.onSelectedItemsChanged}"
        >
          <vaadin-grid-selection-column
            select-all
          ></vaadin-grid-selection-column>

          <vaadin-grid-column
            path="name"
            header="Component"
          ></vaadin-grid-column>

          <vaadin-grid-column-group header="Downloads" text-align="center">
            <vaadin-grid-column
              path="totalOverCustomPeriod"
              header="Selected range"
            ></vaadin-grid-column>

            <vaadin-grid-column
              path="totalOverWeek"
              header="Last 7 days"
            ></vaadin-grid-column>

            <vaadin-grid-column
              path="total"
              header="All the time"
            ></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid>
      </div>
    `;
  }
}
