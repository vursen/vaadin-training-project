import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, query, internalProperty } from 'lit-element';

import '@vaadin/vaadin-combo-box';

import {
  ComboBoxValueChanged,
  ComboBoxElement,
} from '@vaadin/vaadin-combo-box';

import { componentsStore } from '../../stores/components-store';

import { store } from './store';

@customElement('x-overview-page-autocomplete')
export class XOverviewPageAutocomplete extends MobxLitElement {
  @internalProperty()
  isLoading = false;

  @query('#combo-box')
  comboBox!: ComboBoxElement;

  async onValueChanged(event: ComboBoxValueChanged) {
    const name = event.detail.value;

    // Skip the initial event from `<vaadin-combo-box />`
    if (!name) return;

    try {
      this.isLoading = true;

      await componentsStore.fetchComponentStatistics(name);

      store.selectGridItem(name);

      this.comboBox.value = '';
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return html`
      <div class="wrapper">
        <vaadin-combo-box
          id="combo-box"
          label="Add component"
          .items="${componentsStore.components}"
          .disabled="${this.isLoading}"
          placeholder="Enter tag name..."
          item-label-path="name"
          item-value-path="name"
          @value-changed="${this.onValueChanged}"
        ></vaadin-combo-box>
      </div>
    `;
  }
}
