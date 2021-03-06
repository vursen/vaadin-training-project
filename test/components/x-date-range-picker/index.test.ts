import sinon from 'sinon';
import { expect, fixture, html } from '@open-wc/testing';

import { ItemElement } from '@vaadin/vaadin-item';
import { SelectElement } from '@vaadin/vaadin-select';
import { DatePickerElement } from '@vaadin/vaadin-date-picker';

import '../../../src/components/x-date-range-picker';
import { XDateRangePickerElement } from '../../../src/components/x-date-range-picker';

describe('x-date-range-picker', () => {
  let element: XDateRangePickerElement;

  function rangeSelectElement(): SelectElement | null {
    return element.shadowRoot!.querySelector('#range-select');
  }

  function startDateElement(): DatePickerElement {
    return element.shadowRoot!.querySelector('#start-date-picker')!;
  }

  function endDateElement(): DatePickerElement {
    return element.shadowRoot!.querySelector('#end-date-picker')!;
  }

  beforeEach(async () => {
    element = await fixture(html`<x-date-range-picker></x-date-range-picker>`);
  });

  describe('date pickers', () => {
    it(`should not fire the 'value-changed' event when setting only a start date`, async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);

      startDateElement().value = '2021-01-01';

      await element.updateComplete;

      expect(spy).not.to.be.called;
    });

    it(`should not fire the 'value-changed' event when setting only an end date`, async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);

      endDateElement().value = '2021-01-01';

      await element.updateComplete;

      expect(spy).not.to.be.called;
    });

    it(`should fire the 'value-changed' event when setting a date range`, async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);

      startDateElement().value = '2021-01-01';
      endDateElement().value = '2021-01-07';

      await element.updateComplete;

      expect(spy).to.be.calledOnce;
      expect(spy).to.be.calledWithMatch({
        detail: {
          value: '2021-01-01|2021-01-07',
        },
      });
    });
  });

  describe('delimiter property', () => {
    it('should use the `delimiter` property when deserializing a value', async () => {
      element.delimiter = '!';
      element.value = '2021-01-01!2021-01-07';

      await element.updateComplete;

      expect(startDateElement().value).to.equal('2021-01-01');
      expect(endDateElement().value).to.equal('2021-01-07');
    });

    it('should use the `delimiter` property when serializing a value', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);

      element.delimiter = '!';

      startDateElement().value = '2021-01-01';
      endDateElement().value = '2021-01-07';

      await element.updateComplete;

      expect(spy).to.be.calledOnce;
      expect(spy).to.be.calledWithMatch({
        detail: {
          value: '2021-01-01!2021-01-07',
        },
      });
    });
  });

  describe('range select', () => {
    beforeEach(async () => {
      element.ranges = [
        {
          title: 'Last 2 weeks',
          value: '2021-01-01|2021-01-14',
        },
      ];

      await element.updateComplete;
    });

    it('should render the pre-defined ranges', () => {
      const options = rangeSelectElement()!.shadowRoot!.querySelectorAll<ItemElement>(
        'vaadin-list-box vaadin-item'
      );

      expect(options).to.have.lengthOf(2);
      expect(options[0].value).to.equal('');
      expect(options[0].textContent).to.equal('Custom range');
      expect(options[1].value).to.equal('2021-01-01|2021-01-14');
      expect(options[1].textContent).to.equal('Last 2 weeks');
    });

    it(`should not have selected any pre-defined range by default`, () => {
      expect(rangeSelectElement()!.value).to.equal('');
      expect(startDateElement().value).to.equal('');
      expect(endDateElement().value).to.equal('');
    });

    it(`should fire the 'value-changed' event when selecting the pre-defined range`, async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);

      rangeSelectElement()!.value = '2021-01-01|2021-01-14';

      await element.updateComplete;

      expect(spy).to.be.calledOnce;
      expect(spy).to.be.calledWithMatch({
        detail: {
          value: '2021-01-01|2021-01-14',
        },
      });
    });

    it(`should update the date pickers when selecting the pre-defined range`, async () => {
      rangeSelectElement()!.value = '2021-01-01|2021-01-14';

      await element.updateComplete;

      expect(startDateElement().value).to.equal('2021-01-01');
      expect(endDateElement().value).to.equal('2021-01-14');
    });

    it('should disable the date pickers when selecting the pre-defined range', async () => {
      rangeSelectElement()!.value = '2021-01-01|2021-01-14';

      await element.updateComplete;

      expect(startDateElement().disabled).to.be.true;
      expect(endDateElement().disabled).to.be.true;
    });

    it(`should hide the range select when no pre-defined ranges`, async () => {
      element.ranges = [];

      await element.updateComplete;

      expect(rangeSelectElement()).to.be.null;
    });
  });

  describe('date limits', () => {
    it('should set the min date limit when setting a value', async () => {
      element.value = '2021-01-01|';

      await element.updateComplete;

      expect(startDateElement().max).to.equal('');
      expect(endDateElement().min).to.equal('2021-01-01');
    });

    it('should set the max date limit when setting a value', async () => {
      element.value = '|2021-01-01';

      await element.updateComplete;

      expect(startDateElement().max).to.equal('2021-01-01');
      expect(endDateElement().min).to.equal('');
    });

    it('should set the min-max date limit when setting a value', async () => {
      element.value = '2021-01-01|2021-01-07';

      await element.updateComplete;

      expect(startDateElement().max).to.equal('2021-01-07');
      expect(endDateElement().min).to.equal('2021-01-01');
    });
  });
});
