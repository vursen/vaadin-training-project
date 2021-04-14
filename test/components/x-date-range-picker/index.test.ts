import sinon from 'sinon';
import { expect, fixture, html } from '@open-wc/testing';

import { SelectElement } from '@vaadin/vaadin-select';
import { DatePickerElement } from '@vaadin/vaadin-date-picker';

import '../../../src/components/x-date-range-picker';
import { XDateRangePickerElement } from '../../../src/components/x-date-range-picker';

describe('x-date-range-picker', () => {
  let element: XDateRangePickerElement;
  let endDateElement: DatePickerElement;
  let startDateElement: DatePickerElement;
  let rangeSelectElement: SelectElement;

  beforeEach(async () => {
    element = await fixture(html`<x-date-range-picker></x-date-range-picker>`);

    rangeSelectElement = element.shadowRoot!.querySelector('#range-select')!;
    startDateElement = element.shadowRoot!.querySelector('#start-date-picker')!;
    endDateElement = element.shadowRoot!.querySelector('#end-date-picker')!;
  });

  it(`should have selected the custom range option by default`, () => {
    expect(rangeSelectElement.value).to.equal('');
    expect(startDateElement.value).to.equal('');
    expect(endDateElement.value).to.equal('');
  });

  describe('delimiter', () => {
    it('should use the defined delimiter to deserialize the value', async () => {
      element.delimiter = '!';
      element.value = '2021-01-01!2021-01-07';

      await element.updateComplete;

      expect(startDateElement.value).to.equal('2021-01-01');
      expect(endDateElement.value).to.equal('2021-01-07');
    });

    it('should use the defined delimiter to serialize the value', async () => {
      const spy = sinon.spy();

      element.addEventListener('value-changed', spy);
      element.delimiter = '!';

      startDateElement.value = '2021-01-01';
      endDateElement.value = '2021-01-07';

      await element.updateComplete;

      expect(spy).to.be.calledOnce;
      expect(spy).to.be.calledWithMatch({
        detail: {
          value: '2021-01-01!2021-01-07',
        },
      });
    });
  });

  describe('date limits', () => {
    it('should set the min date limit when changing the value', async () => {
      element.value = '2021-01-01|';

      await element.updateComplete;

      expect(startDateElement.max).to.equal('');
      expect(endDateElement.min).to.equal('2021-01-01');
    });

    it('should set the max date limit when changing the value', async () => {
      element.value = '|2021-01-01';

      await element.updateComplete;

      expect(startDateElement.max).to.equal('2021-01-01');
      expect(endDateElement.min).to.equal('');
    });

    it('should set the min and max date limits when changing the value', async () => {
      element.value = '2021-01-01|2021-01-07';

      await element.updateComplete;

      expect(startDateElement.max).to.equal('2021-01-07');
      expect(endDateElement.min).to.equal('2021-01-01');
    });
  });
});
