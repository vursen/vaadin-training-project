import { html, css, customElement, internalProperty } from 'lit-element'
import { MobxLitElement } from '@adobe/lit-mobx'

import '@vaadin/vaadin-app-layout/vaadin-app-layout'
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

  render () {
    return html`
      <vaadin-app-layout class="default-layout">
        <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>

        <h1 slot="navbar">Vaadin Stats</h1>

        Components Count: ${this.componentsStore.components.size}

        <slot></slot>
      </vaadin-app-layout>
    `;
  }
}
