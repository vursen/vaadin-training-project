import { MobxLitElement } from '@adobe/lit-mobx';
import { html, customElement } from 'lit-element';

import { router } from '../../router'

import { componentsStore } from '../../stores/components-store'

@customElement('x-default-layout-sidebar')
export class XDefaultLayoutSidebar extends MobxLitElement {
  get components() {
    return [...componentsStore.components.values()];
  }

  render() {
    return html`
      <div class="default-layout-sidebar">
        <ul>
          <li>
            <a href="${router.urlForName('home')}">
              Overview
            </a>
          </li>

          <vaadin-details>
            <div slot="summary">Components</div>

            <ul>
              ${this.components.map(({ name }) => html`
                <li>
                  <a href="${router.urlForName('component', { name })}">
                    ${name}
                  </a>
                </li>
              `)}
            </ul>
          </vaadin-details>
        </ul>
      </div>
    `;
  }
}
