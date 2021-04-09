import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement } from 'lit-element';

import '@vaadin/vaadin-combo-box';

import { ComboBoxValueChanged } from '@vaadin/vaadin-combo-box';

import { componentsStore } from '../../stores/components-store';

import { store } from './store';

@customElement('x-overview-page-autocomplete')
export class XOverviewPageAutocomplete extends MobxLitElement {
  async onValueChanged(event: ComboBoxValueChanged) {
    // Skip the initial event from `<vaadin-combo-box />`
    if (!event.detail.value) return;

    await componentsStore.fetchComponentStatistics(event.detail.value);

    store.selectGridItem(event.detail.value);
  }

  render() {
    return html`
      <div class="wrapper">
        <vaadin-combo-box
          .items="${componentsStore.components}"
          item-label-path="name"
          item-value-path="name"
          @value-changed="${this.onValueChanged}"
        ></vaadin-combo-box>
      </div>
    `;
  }
}
