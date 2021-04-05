import { html, css, customElement, internalProperty } from 'lit-element'
import { MobxLitElement } from '@adobe/lit-mobx'

import '@vaadin/vaadin-details'
import '@vaadin/vaadin-app-layout'
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle'

import { componentsStore } from '../stores/components-store.js'

@customElement('x-default-layout')
export class XDefaultLayout extends MobxLitElement {
  @internalProperty()
  componentsStore = componentsStore

  static get styles() {
    return css`
      h1 {
        margin: 0 var(--lumo-space-s);
        font-size: var(--lumo-font-size-l);
      }
    `;
  }

  async connectedCallback () {
    super.connectedCallback?.()

    await this.componentsStore.fetchComponents()
  }

  get isLoading () {
    return this.componentsStore.components.size === 0
  }

  get components () {
    return [...this.componentsStore.components.values()]
  }

  render () {
    return html`
      <vaadin-app-layout class="default-layout">
        <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>

        <h1 slot="navbar">Vaadin Stats</h1>

        <ul slot="drawer">
          <li>
            <a href="#">Overview</a>
          </li>

          <vaadin-details>
            <div slot="summary">
              Components
            </div>

            <ul>
              ${this.components.map((component) => html`
                <li>
                  <a href="#">${component.name}</a>
                </li>
              `)}
            </ul>
          </vaadin-details>
        </ul>

        <slot></slot>
      </vaadin-app-layout>
    `;
  }
}
