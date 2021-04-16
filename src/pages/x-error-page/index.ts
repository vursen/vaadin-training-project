import { MobxLitElement } from '@adobe/lit-mobx';
import { css, html, customElement } from 'lit-element';

@customElement('x-error-page')
export class XErrorPage extends MobxLitElement {
  static get styles() {
    return css`
      .title {
        margin: 0;
        font-size: var(--lumo-font-size-xl);
      }
    `;
  }

  render() {
    return html`<h1 class="title">Something went wrong. Please try again.</h1>`;
  }
}
