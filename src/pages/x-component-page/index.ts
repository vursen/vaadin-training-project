import {
  css,
  html,
  LitElement,
  customElement,
  internalProperty,
} from 'lit-element';

import { router } from '../../router';

import { periodStore } from '../../stores/period-store';

import '../../components/x-date-range-picker';
import { XDateRangePickerValueChangedEvent } from '../../components/x-date-range-picker';

import { store } from './store';

import './x-grid';
import './x-chart';

@customElement('x-component-page')
export class XComponentPageElement extends LitElement {
  @internalProperty()
  location = router.location;

  static get styles() {
    return css`
      .title {
        margin: 0 0 var(--lumo-space-s);
        font-size: var(--lumo-font-size-xxl);
      }

      .date-range-picker {
        display: block;
        margin: 0 0 var(--lumo-space-m);
      }

      .subtitle {
        margin: 0 0 var(--lumo-space-m);
        font-size: var(--lumo-font-size-l);
      }

      .chart {
        display: block;
        margin-bottom: var(--lumo-space-m);
      }
    `;
  }

  onDateRangePickerValueChanged(event: XDateRangePickerValueChangedEvent) {
    periodStore.setPeriod(event.detail.value);
  }

  render() {
    return html`
      <div class="wrapper">
        <h1 class="title">Component: ${store.component.name}</h1>

        <x-date-range-picker
          class="date-range-picker"
          .value="${periodStore.period}"
          .ranges="${periodStore.periods}"
          @value-changed="${this.onDateRangePickerValueChanged}"
        ></x-date-range-picker>

        <h2 class="subtitle">Downloads</h2>

        <x-component-page-chart class="chart"></x-component-page-chart>
        <x-component-page-grid class="grid"></x-component-page-grid>
      </div>
    `;
  }
}
