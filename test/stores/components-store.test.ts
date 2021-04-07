import sinon from 'sinon';
import { when } from 'mobx';
import { expect } from '@open-wc/testing';

import { api } from '../../src/api/index.js';
import { ComponentsStore } from '../../src/stores/components-store.js';

import * as fixtures from '../fixtures/index.js';

describe('components store', () => {
  let store: ComponentsStore;
  let sandbox: sinon.SinonSandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(api, 'fetchComponents').resolves(fixtures.api.components);
    sandbox
      .stub(api, 'fetchComponentStatistics')
      .withArgs('vaadin-button')
      .resolves(fixtures.api.componentStatistics);
  });

  beforeEach(async () => {
    store = new ComponentsStore({
      api,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should fetch components', async () => {
    store.fetchComponents();

    await when(() => store.components.size === 30);

    expect(api.fetchComponents).to.have.been.calledOnce;

    expect(store.components.get('vaadin-button')).to.deep.equal({
      name: 'vaadin-button',
      npmName: '@vaadin/vaadin-button',
      version: '20.0.0-alpha3',
    });
  });

  it('should fetch component statistics', async () => {
    store.fetchComponentStatistics('vaadin-button');

    await when(() => store.statistics.size === 1);

    expect(api.fetchComponentStatistics).to.have.been.calledOnce;

    const component = store.statistics.get('vaadin-button')!;

    expect(component.downloads).to.have.lengthOf(8);
    expect(component.downloads[0].date).to.equal('08/02/2021');
    expect(component.downloads[0].versions).to.deep.equal({
      '20.0.0-alpha2': 0,
      '20.0.0-alpha1': 0,
    });
  });
});
