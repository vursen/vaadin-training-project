import { autorun } from 'mobx';
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
  grid!: GridElement

  async connectedCallback () {
    super.connectedCallback()
  }

  onSelectedItemsChanged(event: GridSelectedItemsChanged) {
    console.log(event.detail.value)

    const selectedItems = this.grid.selectedItems as Store['selectedItems']
    const selectedItemIds = selectedItems.map(({ id }) => id)

    // store.setSelectedItemIds(selectedItemIds)
  }

  render() {
    console.log('Items', store.items)
    console.log('Selected Items', store.selectedItems)
    return html`
      <div class="overview-page-grid">
        <vaadin-grid
          id="grid"
          .items="${store.items}"
          .selectedItems="${store.selectedItems}"
          @selected-items-changed="${this.onSelectedItemsChanged}"
        >
          <vaadin-grid-selection-column></vaadin-grid-selection-column>

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
