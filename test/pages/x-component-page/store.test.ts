import sinon from 'sinon';
import { expect } from '@open-wc/testing';

import { api } from '../../../src/api';

import { PeriodStore } from '../../../src/stores/period-store';
import { ComponentsStore } from '../../../src/stores/components-store';

import { Store } from '../../../src/pages/x-component-page/store';

import * as fixtures from '../../fixtures';

describe('component page store', () => {
  let sandbox: sinon.SinonSandbox;

  let store: Store;
  let periodStore: PeriodStore;
  let componentsStore: ComponentsStore;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(api, 'fetchComponents').resolves(fixtures.api.components);
    sandbox
      .stub(api, 'fetchComponentStatistics')
      .resolves(fixtures.api.componentStatistics);
  });

  beforeEach(async () => {
    periodStore = new PeriodStore();

    componentsStore = new ComponentsStore({
      api,
    });

    store = new Store({
      periodStore,
      componentsStore,
    });

    await store.fetch('vaadin-button');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should compute grid items', () => {
    expect(store.gridItems).to.have.lengthOf(2);
    expect(store.gridItems[0]).to.deep.equal({
      version: '20.0.0-alpha2',
      dates: {
        '2021-03-15': 0,
        '2021-03-22': 0,
        '2021-03-29': 78,
      },
    });
  });

  it('should compute grid date columns', () => {
    expect(store.gridDateColumns).to.have.lengthOf(3);
    expect(store.gridDateColumns[0]).to.deep.equal({
      path: 'dates.2021-03-15',
      header: '15/03',
    });
  });

  it('should compute chart series', () => {
    expect(store.chartSeries[0]).to.deep.equal({
      version: '20.0.0-alpha2',
      values: [0, 0, 78],
    });
  });

  it('should compute chart categores', () => {
    expect(store.chartCategories).to.deep.equal(['15/03', '22/03', '29/03']);
  });
});
