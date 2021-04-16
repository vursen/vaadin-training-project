import { MobxLitElement } from '@adobe/lit-mobx';
import { html, css, customElement } from 'lit-element';

import '@vaadin/vaadin-details';
import '@vaadin/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';

import './x-sidebar';

import { componentsStore } from '../../stores/components-store';

export async function fetch() {
  await componentsStore.fetchComponents();
}

@customElement('x-default-layout')
export class XDefaultLayout extends MobxLitElement {
  static get styles() {
    return css`
      .title {
        margin: 0 var(--lumo-space-s);
        font-size: var(--lumo-font-size-l);
      }

      .content {
        padding: var(--lumo-space-m);
      }
    `;
  }

  render() {
    return html`
      <vaadin-app-layout class="wrapper">
        <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>

        <h1 class="title" slot="navbar">Vaadin Stats</h1>

        <x-default-layout-sidebar slot="drawer"></x-default-layout-sidebar>

        <div class="content">
          <slot></slot>
        </div>
      </vaadin-app-layout>
    `;
  }
}
