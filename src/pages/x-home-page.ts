import { LitElement, html, customElement } from 'lit-element';

@customElement('x-home-page')
export class XHomePage extends LitElement {
  render () {
    return html`
      <div class="home-page">
        Home Page
      </div>
    `;
  }
}
