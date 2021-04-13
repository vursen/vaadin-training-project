type CustomEventDetail<T> = T extends CustomEvent<infer P> ? P : T;

/**
 * Fired when the `to` property changes
 */
export class ToChanged extends CustomEvent<{ value: string }> {}

/**
 * Creates a `to-changed` event
 */
export function createToChangedEvent(detail: CustomEventDetail<ToChanged>) {
  return new ToChanged('to-changed', { detail });
}

/**
 * Fired when the `from` property changes
 */
export class FromChanged extends CustomEvent<{ value: string }> {}

/**
 * Creates a `from-changed` event
 */
export function createFromChangedEvent(detail: CustomEventDetail<FromChanged>) {
  return new FromChanged('from-changed', { detail });
}
