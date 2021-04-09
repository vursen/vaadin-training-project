import { render } from 'lit-html';
import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, property } from 'lit-element';

import '@vaadin/vaadin-item';
import '@vaadin/vaadin-select';
import '@vaadin/vaadin-list-box';
import '@vaadin/vaadin-date-picker';

import { DatePickerValueChanged } from '@vaadin/vaadin-date-picker';

@customElement('x-date-range')
export class XDateRange extends MobxLitElement {
  @property({ type: String })
  from?: string;

  @property({ type: String })
  to?: string;

  renderSelectItems(root: HTMLElement) {
    render(
      html`
        <vaadin-list-box>
          <vaadin-item value="last2weeks">Last 2 weeks</vaadin-item>
          <vaadin-item value="last4weeks">Last 4 weeks</vaadin-item>
          <vaadin-item value="custom">Custom range</vaadin-item>
        </vaadin-list-box>
      `,
      root
    );
  }

  onFromValueChanged(event: DatePickerValueChanged) {
    this.from = event.detail.value;
  }

  onToValueChanged(event: DatePickerValueChanged) {
    this.to = event.detail.value;
  }

  render() {
    return html`
      <div class="wrapper">
        <vaadin-select
          label="Select range"
          .renderer="${this.renderSelectItems}"
        ></vaadin-select>

        <vaadin-date-picker
          label="From"
          .max="${this.to}"
          clear-button-visible
          @value-changed="${this.onFromValueChanged}"
        ></vaadin-date-picker>

        <vaadin-date-picker
          label="To"
          .min="${this.from}"
          clear-button-visible
          @value-changed="${this.onToValueChanged}"
        ></vaadin-date-picker>
      </div>
    `;
  }
}
