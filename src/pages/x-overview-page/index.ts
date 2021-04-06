import { MobxLitElement } from '@adobe/lit-mobx';
import { css, html, customElement } from 'lit-element';

import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';

import { componentsStore } from '../../stores/components-store'

import { store } from './store'

@customElement('x-overview-page')
export class XOverviewPage extends MobxLitElement {
  static get styles() {
    return css`
      .overview-page {
        padding: var(--lumo-space-m);
      }
    `;
  }

  async connectedCallback () {
    super.connectedCallback()

    // TODO: Remove as the components selector will have been implemented
    await Promise.all([
      componentsStore.fetchComponentStatistics('vaadin-button'),
      componentsStore.fetchComponentStatistics('vaadin-avatar')
    ])
  }

  render() {
    return html`
      <div class="overview-page">
        <vaadin-grid .items="${store.items}">
          <vaadin-grid-selection-column></vaadin-grid-selection-column>

          <vaadin-grid-column path="name" header="Component"></vaadin-grid-column>

          <vaadin-grid-column-group
            header="Downloads"
            text-align="center"
          >
            <vaadin-grid-column path="totalOverCustomPeriod" header="Selected range"></vaadin-grid-column>
            <vaadin-grid-column path="totalOverWeek" header="Last 7 days"></vaadin-grid-column>
            <vaadin-grid-column path="total" header="All the time"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid>
      </div>
    `;
  }
}
