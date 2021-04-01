import { html, fixture, expect } from '@open-wc/testing';

import '../src/x-app.js';
import { XApp } from '../src/x-app.js';

describe('XApp', () => {
  let element: XApp;

  beforeEach(async () => {
    element = await fixture(html`<x-app></x-app>`);
  });

  it('should render some content', () => {
    const content = element.shadowRoot!.querySelector('.content')!;
    expect(content).to.exist;
    expect(content.textContent).to.contains('My Layout Content');
  });

  // it('passes the a11y audit', async () => {
  //   await expect(element).shadowDom.to.be.accessible();
  // });
});
