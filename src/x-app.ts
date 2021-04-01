import { LitElement, html, customElement } from 'lit-element';

import './components/x-layout.js'

@customElement('x-app')
export class XApp extends LitElement {
  render () {
    return html`
      <x-layout>
        <div class="content">
          My Layout Content
        </div>
      </x-layout>
    `;
  }
}
