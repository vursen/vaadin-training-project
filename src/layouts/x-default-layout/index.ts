import { MobxLitElement } from '@adobe/lit-mobx';
import { html, css, customElement } from 'lit-element';

import '@vaadin/vaadin-details';
import '@vaadin/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';

import './x-sidebar';

import { componentsStore } from '../../stores/components-store';

@customElement('x-default-layout')
export class XDefaultLayout extends MobxLitElement {
  static get styles() {
    return css`
      .wrapper {
        --vaadin-app-layout-transition: 0ms;
      }

      .title {
        margin: 0 var(--lumo-space-s);
        font-size: var(--lumo-font-size-l);
      }
    `;
  }

  async connectedCallback() {
    super.connectedCallback();

    await componentsStore.fetchComponents();
  }

  get isLoading() {
    return componentsStore.componentsMap.size === 0;
  }

  render() {
    return html`
      <vaadin-app-layout class="wrapper">
        ${this.isLoading
          ? html`Loading`
          : html`
              <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>

              <h1 class="title" slot="navbar">Vaadin Stats</h1>

              <x-default-layout-sidebar
                slot="drawer"
              ></x-default-layout-sidebar>

              <slot></slot>
            `}
      </vaadin-app-layout>
    `;
  }
}
