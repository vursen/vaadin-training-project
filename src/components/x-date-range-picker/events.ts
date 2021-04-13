/**
 * Fired when the `value` property changes
 */
export class ValueChangedEvent extends CustomEvent<ValueChangedEventDetail> {
  constructor(detail: ValueChangedEventDetail) {
    super('value-changed', { detail });
  }
}

type ValueChangedEventDetail = { value: string };
