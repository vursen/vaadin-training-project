import { LitElement, html, customElement } from 'lit-element';

@customElement('x-component-page')
export class XComponentPage extends LitElement {
  render() {
    return html` <div class="component-page">Component Page</div> `;
  }
}
