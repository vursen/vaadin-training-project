import { render } from 'lit-html';
import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, property } from 'lit-element';

import '@vaadin/vaadin-item';
import '@vaadin/vaadin-select';
import '@vaadin/vaadin-list-box';
import '@vaadin/vaadin-date-picker';

import { SelectValueChanged } from '@vaadin/vaadin-select';
import { DatePickerValueChanged } from '@vaadin/vaadin-date-picker';

import {
  deserializeDateRange,
  serializeDateRange,
  today,
  weeksAgo,
} from './helpers';

@customElement('x-date-range-picker')
export class XDateRangePicker extends MobxLitElement {
  /**
   * The property keeps the start date of the range.
   *
   * Supports only the ISO 8601 date format `"YYYY-MM-DD"`
   */
  @property({ type: String })
  from?: string;

  /**
   * The property keeps the end date of the range.
   *
   * Supports only the ISO 8601 date format `"YYYY-MM-DD"`
   */
  @property({ type: String })
  to?: string;

  /**
   * The property is used to set up pre-defined date ranges.
   *
   * Supports only the ISO 8601 date format `"YYYY-MM-DD"` for the properties `from`, `to`.
   *
   * Example:
   *
   * ```
   * [{ title: 'Last week', from: '01-07-2021', to: '07-07-2021' }]
   * ```
   */
  @property({ type: Array })
  ranges = [
    {
      title: 'Last 2 weeks',
      from: weeksAgo(new Date(), 2),
      to: today(),
    },
    {
      title: 'Last 4 weeks',
      from: weeksAgo(new Date(), 4),
      to: today(),
    },
  ];

  get value() {
    return [this.from, this.to];
  }

  private get selectValue() {
    const range = this.ranges.find(({ from, to }) => {
      return serializeDateRange([from, to]) === serializeDateRange(this.value);
    });

    // If a pre-defined range is selected
    if (range) {
      const { from, to } = range;

      return serializeDateRange([from, to]);
    }

    return '';
  }

  private get isCustomDateDisabled() {
    return this.selectValue !== '';
  }

  private onSelectValueChanged(event: SelectValueChanged) {
    const { value } = event.detail;

    if (value === '') {
      // TODO: Fire events instead
      this.to = undefined;
      this.from = undefined;
      return;
    }

    const [from, to] = deserializeDateRange(value);

    // TODO: Fire events instead
    this.from = from;
    this.to = to;
  }

  private renderSelect = (root: HTMLElement) => {
    const ranges = this.ranges.map(({ from, to, title }) => {
      const value = serializeDateRange([from, to]);

      return html`<vaadin-item value="${value}">${title}</vaadin-item>`;
    });

    render(
      html`
        <vaadin-list-box>
          <vaadin-item value="">Custom range</vaadin-item>
          ${ranges}
        </vaadin-list-box>
      `,
      root
    );
  };

  private onFromValueChanged(event: DatePickerValueChanged) {
    // TODO: Fire events instead
    this.from = event.detail.value || undefined;
  }

  private onToValueChanged(event: DatePickerValueChanged) {
    // TODO: Fire events instead
    this.to = event.detail.value || undefined;
  }

  render() {
    return html`
      <div class="wrapper">
        <vaadin-select
          label="Select range"
          .value="${this.selectValue}"
          @value-changed="${this.onSelectValueChanged}"
          .renderer="${this.renderSelect}"
        ></vaadin-select>

        <vaadin-date-picker
          label="From"
          .max="${this.to}"
          .disabled="${this.isCustomDateDisabled}"
          clear-button-visible
          .value="${this.from || ''}"
          @value-changed="${this.onFromValueChanged}"
        ></vaadin-date-picker>

        <vaadin-date-picker
          label="To"
          .min="${this.from}"
          .disabled="${this.isCustomDateDisabled}"
          clear-button-visible
          .value="${this.to || ''}"
          @value-changed="${this.onToValueChanged}"
        ></vaadin-date-picker>
      </div>
    `;
  }
}
