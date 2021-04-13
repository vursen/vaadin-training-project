import { render } from 'lit-html';
import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, property } from 'lit-element';

import '@vaadin/vaadin-item';
import '@vaadin/vaadin-select';
import '@vaadin/vaadin-list-box';
import '@vaadin/vaadin-date-picker';

import { SelectValueChanged } from '@vaadin/vaadin-select';
import { DatePickerValueChanged } from '@vaadin/vaadin-date-picker';

import { createFromChangedEvent, createToChangedEvent } from './events';

import {
  today,
  weeksAgo,
  serializeDateRange,
  deserializeDateRange,
} from './helpers';

@customElement('x-date-range-picker')
export class XDateRangePickerElement extends MobxLitElement {
  /**
   * The start date of the range.
   *
   * Supported date format: ISO 8601 `"YYYY-MM-DD"`
   */
  @property({ type: String })
  from = '';

  /**
   * The end date of the range.
   *
   * Supported date format: ISO 8601 `"YYYY-MM-DD"`
   */
  @property({ type: String })
  to = '';

  /**
   * An array that contains pre-defined date ranges.
   *
   * Supported date format: ISO 8601 `"YYYY-MM-DD"`
   *
   * Should match the following structure:
   * ```
   * [
   *  { title: 'Last week', from: '07-07-2021', to: '14-07-2021' },
   *  { title: 'Last 2 weeks', from: '01-07-2021', to: '14-07-2021' },
   * ]
   * ```
   */
  @property({ type: Array })
  ranges = [
    { title: 'Last 2 weeks', from: weeksAgo(2), to: today() },
    { title: 'Last 4 weeks', from: weeksAgo(4), to: today() },
  ];

  get selectValue() {
    const range = this.ranges.find(({ from, to }) => {
      return (
        serializeDateRange([from, to]) ===
        serializeDateRange([this.from, this.to])
      );
    });

    // Check if a pre-defined range is selected
    if (range) {
      const { from, to } = range;

      return serializeDateRange([from, to]);
    }

    return '';
  }

  get isCustomDateDisabled() {
    return this.selectValue !== '';
  }

  onFromValueChanged({ detail }: DatePickerValueChanged) {
    this.dispatchEvent(createFromChangedEvent({ value: detail.value }));
  }

  onToValueChanged({ detail }: DatePickerValueChanged) {
    this.dispatchEvent(createToChangedEvent({ value: detail.value }));
  }

  onSelectValueChanged({ detail }: SelectValueChanged) {
    let from = '';
    let to = '';

    if (detail.value) {
      [from, to] = deserializeDateRange(detail.value);
    }

    this.dispatchEvent(createFromChangedEvent({ value: from }));
    this.dispatchEvent(createToChangedEvent({ value: to }));
  }

  renderSelect = (root: HTMLElement) => {
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
          .value="${this.from}"
          @value-changed="${this.onFromValueChanged}"
        ></vaadin-date-picker>

        <vaadin-date-picker
          label="To"
          .min="${this.from}"
          .disabled="${this.isCustomDateDisabled}"
          clear-button-visible
          .value="${this.to}"
          @value-changed="${this.onToValueChanged}"
        ></vaadin-date-picker>
      </div>
    `;
  }
}

export {
  FromChanged as XDateRangePickerFromChanged,
  ToChanged as XDateRangePickerToChanged,
} from './events';
