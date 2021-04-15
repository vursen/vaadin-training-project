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

    await when(() => store.componentsMap.size > 0);

    expect(api.fetchComponents).to.have.been.calledOnce;

    expect(store.componentsMap).to.have.lengthOf(9);
    expect(store.componentsMap.get('vaadin-button')).to.deep.equal({
      name: 'vaadin-button',
      npmName: '@vaadin/vaadin-button',
      version: '20.0.0-alpha3',
    });
  });

  it('should fetch component statistics', async () => {
    store.fetchComponentStatistics('vaadin-button');

    await when(() => store.statisticsMap.size > 0);

    expect(api.fetchComponentStatistics).to.have.been.calledOnce;

    expect(store.statisticsMap).to.have.lengthOf(1);

    const component = store.statisticsMap.get('vaadin-button')!;

    expect(component.downloads).to.have.lengthOf(3);
    expect(component.downloads[0]).to.deep.equal({
      date: '2021-03-15',
      total: 29,
      versions: {
        '20.0.0-alpha2': 0,
        '20.0.0-alpha1': 29,
      },
    });
  });

  it('should have a components getter', async () => {
    store.fetchComponents();

    await when(() => store.components.length > 0);

    expect(store.components).to.have.lengthOf(9);
    expect(store.components[0]).to.deep.equal({
      name: 'vaadin-button',
      npmName: '@vaadin/vaadin-button',
      version: '20.0.0-alpha3',
    });
  });

  it('should have a statistics getter', async () => {
    store.fetchComponentStatistics('vaadin-button');

    await when(() => store.statistics.length > 0);

    expect(store.statistics).to.have.lengthOf(1);
    expect(store.statistics[0].name).to.equal('vaadin-button');
    expect(store.statistics[0].downloads).to.have.lengthOf(3);
  });
});
