import { Context } from '@vaadin/router';
import {
  css,
  html,
  LitElement,
  customElement,
  internalProperty,
} from 'lit-element';

import { router } from '../../router';

import { periodStore } from '../../stores/period-store';
import { componentsStore } from '../../stores/components-store';

import '../../components/x-date-range-picker';
import { XDateRangePickerValueChangedEvent } from '../../components/x-date-range-picker';

export async function fetch(context: Context) {
  const name = String(context.params.name);

  await componentsStore.fetchComponentStatistics(name);
}

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
    `;
  }

  get componentName() {
    return String(this.location.params.name);
  }

  get component() {
    return componentsStore.componentsMap.get(this.componentName)!;
  }

  onDateRangePickerValueChanged(event: XDateRangePickerValueChangedEvent) {
    periodStore.setPeriod(event.detail.value);
  }

  render() {
    return html`
      <div class="wrapper">
        <h1 class="title">Component: ${this.component.name}</h1>

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
