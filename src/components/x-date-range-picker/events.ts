/**
 * Fired when the `value` property changes
 */
export class ValueChangedEvent extends CustomEvent<ValueChangedEventDetail> {
  constructor(detail: ValueChangedEventDetail) {
    super('value-changed', {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

type ValueChangedEventDetail = { value: string };
