import { render } from 'lit-html';
import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, query } from 'lit-element';

import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';

import {
  GridElement,
  GridItemModel,
  GridSelectedItemsChanged,
} from '@vaadin/vaadin-grid';

import { GridColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-column';

import { store, Store } from './store';

@customElement('x-overview-page-grid')
export class XOverviewPageGridElement extends MobxLitElement {
  @query('#grid')
  grid!: GridElement;

  onSelectedItemsChanged(_event: GridSelectedItemsChanged) {
    // TODO: Use `event.detail.value` instead of `this.grid.selectedItems`
    // as soon as https://github.com/vaadin/web-components/issues/197 will be resolved
    const selectedItems = this.grid.selectedItems as Store['selectedGridItems'];

    // Skip when the event comes with the same selected items so that nothing needs to be updated.
    // That prevents recurring of Mobx actions' calls
    if (selectedItems === store.selectedGridItems) {
      return;
    }

    const selectedItemIds = selectedItems.map(({ id }) => id);

    store.setSelectedGridItems(selectedItemIds);
  }

  renderNameColumn(
    root: HTMLElement,
    _column: GridColumnElement,
    model: GridItemModel
  ) {
    const item = model.item as Store['gridItems'][0];

    render(
      html`
        <a href="https://www.npmjs.com/package/${item.npmName}" target="_blank">
          ${item.name}
        </a>
      `,
      root
    );
  }

  render() {
    return html`
      <div class="wrapper">
        <vaadin-grid
          id="grid"
          .items="${store.gridItems}"
          .selectedItems="${store.selectedGridItems}"
          @selected-items-changed="${this.onSelectedItemsChanged}"
        >
          <vaadin-grid-selection-column
            select-all
          ></vaadin-grid-selection-column>

          <vaadin-grid-column
            path="name"
            header="Component"
            .renderer="${this.renderNameColumn}"
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
