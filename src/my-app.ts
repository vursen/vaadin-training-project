import { LitElement, html, customElement } from 'lit-element';

import './components/my-layout.js'

@customElement('my-app')
export class MyApp extends LitElement {
  render () {
    return html`
      <my-layout>
        <div class="content">
          My Layout Content
        </div>
      </my-layout>
    `;
  }
}
