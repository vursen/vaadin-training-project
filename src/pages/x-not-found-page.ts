import { LitElement, html, customElement } from 'lit-element';

@customElement('x-not-found-page')
export class XNotFoundPageElement extends LitElement {
  render() {
    return html` <div class="not-found-page">Not Found Page</div> `;
  }
}
