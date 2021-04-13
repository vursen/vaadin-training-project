import { render } from 'lit-html';
import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement, property } from 'lit-element';

import '@vaadin/vaadin-item';
import '@vaadin/vaadin-select';
import '@vaadin/vaadin-list-box';
import '@vaadin/vaadin-date-picker';

import { SelectValueChanged } from '@vaadin/vaadin-select';
import { DatePickerValueChanged } from '@vaadin/vaadin-date-picker';

import { ValueChangedEvent } from './events';

import {
  today,
  weeksAgo,
  serializeDateRange,
  deserializeDateRange,
} from './helpers';

@customElement('x-date-range-picker')
export class XDateRangePickerElement extends MobxLitElement {
  /**
   * The value for this element.
   *
   * `"YYYY-MM-DD|YYYY-MM-DD"`
   *
   * Supports only the ISO 8601 date format and should use the delimiter
   * defined in the `delimiter` property (default: `|`).
   */
  @property({ type: String })
  value = '';

  /**
   * The delimiter that is used to split date range into
   * `start` date and `end` date.
   */
  @property({ type: String })
  delimiter = '|';

  /**
   * An array that contains pre-defined date ranges.
   *
   * Should match the following structure:
   * ```
   * [
   *  { title: 'Last 2 weeks', value: '14-07-2021|28-07-2021' },
   *  { title: 'Last 4 weeks', value: '01-07-2021|28-07-2021' },
   * ]
   * ```
   *
   * The `value` property supports only the ISO 8601 date format and should use the delimiter
   * defined in the `delimiter` property (default: `|`).
   */
  @property({ type: Array })
  ranges = [
    {
      title: 'Last 2 weeks',
      value: serializeDateRange([weeksAgo(2), today()]),
    },
    {
      title: 'Last 4 weeks',
      value: serializeDateRange([weeksAgo(4), today()]),
    },
  ];

  get startValue() {
    return deserializeDateRange(this.value)[0];
  }

  get endValue() {
    return deserializeDateRange(this.value)[1];
  }

  get selectValue() {
    const range = this.ranges.find(({ value }) => {
      return this.value === value;
    });

    // Check if a pre-defined range is selected
    if (range) {
      return range.value;
    }

    return '';
  }

  get isCustomDateDisabled() {
    return this.selectValue !== '';
  }

  onStartValueChanged(event: DatePickerValueChanged) {
    const { value } = event.detail;

    this.value = serializeDateRange([value, this.endValue]);

    if (this.startValue && this.endValue) {
      this.dispatchEvent(new ValueChangedEvent({ value }));
    }
  }

  onEndValueChanged(event: DatePickerValueChanged) {
    const { value } = event.detail;

    this.value = serializeDateRange([this.startValue, value]);

    if (this.startValue && this.endValue) {
      this.dispatchEvent(new ValueChangedEvent({ value }));
    }
  }

  onSelectValueChanged(event: SelectValueChanged) {
    const { value } = event.detail;

    this.value = value || '';

    if (this.startValue && this.endValue) {
      this.dispatchEvent(new ValueChangedEvent({ value }));
    }
  }

  renderSelect = (root: HTMLElement) => {
    const ranges = this.ranges.map(({ value, title }) => {
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
          id="range-select"
          label="Select range"
          .value="${this.selectValue}"
          @value-changed="${this.onSelectValueChanged}"
          .renderer="${this.renderSelect}"
        ></vaadin-select>

        <vaadin-date-picker
          id="start-date-picker"
          label="From"
          .max="${this.endValue}"
          .disabled="${this.isCustomDateDisabled}"
          clear-button-visible
          .value="${this.startValue}"
          @value-changed="${this.onStartValueChanged}"
        ></vaadin-date-picker>

        <vaadin-date-picker
          id="end-date-picker"
          label="To"
          .min="${this.startValue}"
          .disabled="${this.isCustomDateDisabled}"
          clear-button-visible
          .value="${this.endValue}"
          @value-changed="${this.onEndValueChanged}"
        ></vaadin-date-picker>
      </div>
    `;
  }
}

export { ValueChangedEvent as XDateRangePickerValueChangedEvent } from './events';
