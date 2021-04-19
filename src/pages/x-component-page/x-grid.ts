import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, query } from 'lit-element';

import '@vaadin/vaadin-grid';
import { GridElement } from '@vaadin/vaadin-grid';

import { store } from './store';

@customElement('x-component-page-grid')
export class XComponentPageGrid extends MobxLitElement {
  @query('#grid')
  grid!: GridElement;

  renderDateColumns() {
    return store.gridDateColumns.map(
      ({ path, header }) => html`
        <vaadin-grid-column
          .path="${path}"
          .header="${header}"
        ></vaadin-grid-column>
      `
    );
  }

  render() {
    return html`
      <div class="wrapper">
        <vaadin-grid id="grid" .items="${store.gridItems}">
          <vaadin-grid-column
            path="version"
            header="Version"
          ></vaadin-grid-column>

          ${this.renderDateColumns()}
        </vaadin-grid>
      </div>
    `;
  }
}
