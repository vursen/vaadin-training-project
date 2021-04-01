import { LitElement, html, customElement } from 'lit-element';

@customElement('x-default-layout')
export class XDefaultLayout extends LitElement {
  render () {
    return html`
      <div class="default-layout">
        <slot></slot>
      </div>
    `;
  }
}
