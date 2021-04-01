import { html, fixture, expect } from '@open-wc/testing';

import '../src/my-app.js';
import { MyApp } from '../src/my-app.js';

describe('MyApp', () => {
  let element: MyApp;

  beforeEach(async () => {
    element = await fixture(html`<my-app></my-app>`);
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
