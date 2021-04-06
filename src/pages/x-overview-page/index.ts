import { LitElement, html, customElement } from 'lit-element';

@customElement('x-overview-page')
export class XOverviewPage extends LitElement {
  render() {
    return html`
      <div class="overview-page">
        Overview Page
      </div>
    `;
  }
}
