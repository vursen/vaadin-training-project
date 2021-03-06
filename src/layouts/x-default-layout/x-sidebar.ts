import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement } from 'lit-element';

import { router } from '../../router';

import { componentsStore } from '../../stores/components-store';

@customElement('x-default-layout-sidebar')
export class XDefaultLayoutSidebar extends MobxLitElement {
  renderComponents() {
    return componentsStore.components.map(
      ({ name }) => html`
        <li>
          <a href="${router.urlForName('component', { name })}">${name}</a>
        </li>
      `
    );
  }

  render() {
    return html`
      <div class="default-layout-sidebar">
        <ul>
          <li>
            <a href="${router.urlForName('overview')}"> Overview </a>
          </li>

          <vaadin-details>
            <div slot="summary">Components</div>

            <ul>
              ${this.renderComponents()}
            </ul>
          </vaadin-details>
        </ul>
      </div>
    `;
  }
}
