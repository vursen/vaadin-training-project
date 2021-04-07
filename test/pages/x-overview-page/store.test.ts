import sinon from 'sinon';
import { when } from 'mobx';
import { expect } from '@open-wc/testing';

import { api } from '../../../src/api';

import { ComponentsStore } from '../../../src/stores/components-store';

import { Store } from '../../../src/pages/x-overview-page/store';

import * as fixtures from '../../fixtures';

describe('overview page store', () => {
  let sandbox: sinon.SinonSandbox;

  let store: Store;
  let componentsStore: ComponentsStore;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox
      .stub(api, 'fetchComponentStatistics')
      .resolves(fixtures.api.componentStatistics);
  });

  beforeEach(async () => {
    componentsStore = new ComponentsStore({
      api,
    });

    store = new Store({
      componentsStore,
    });

    await componentsStore.fetchComponentStatistics('vaadin-button');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should aggregate the totals of items', () => {
    expect(store.items).to.be.deep.equal([
      {
        name: 'vaadin-button',
        total: 218,
        totalOverWeek: 0,
        totalOverCustomPeriod: 218
      }
    ])
  });

  // it('should aggregate the totals of items with the custom period', () => {
  //   // TODO: Implement
  // })
});
