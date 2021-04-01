import '@vaadin/vaadin-app-layout';

import { LitElement, html, customElement } from 'lit-element';

@customElement('my-layout')
export class MyLayout extends LitElement {
  render () {
    return html`
      <vaadin-app-layout>
        <slot></slot>
      </vaadin-app-layout>
    `;
  }
}
