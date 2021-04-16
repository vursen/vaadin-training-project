import { LitElement, customElement, html, css } from 'lit-element';

import { periodStore } from '../stores/period-store';

import '../components/x-date-range-picker';
import { XDateRangePickerValueChangedEvent } from '../components/x-date-range-picker';

@customElement('x-component-page')
export class XComponentPageElement extends LitElement {
  static get styles() {
    return css`
      .wrapper {
        padding: var(--lumo-space-m);
      }
    `;
  }

  onDateRangePickerValueChanged(event: XDateRangePickerValueChangedEvent) {
    periodStore.setPeriod(event.detail.value);
  }

  render() {
    return html`
      <div class="wrapper">
        <x-date-range-picker
          class="date-range-picker"
          .value="${periodStore.period}"
          .ranges="${periodStore.periods}"
          @value-changed="${this.onDateRangePickerValueChanged}"
        ></x-date-range-picker>
      </div>
    `;
  }
}
