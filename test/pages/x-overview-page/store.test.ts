import sinon from 'sinon';
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
        id: 'vaadin-button',
        name: 'vaadin-button',
        total: 218,
        totalOverWeek: 146,
        totalOverCustomPeriod: 218,
      },
    ]);
  });

  // it('should aggregate the totals of items with the custom period', () => {
  //   // TODO: Implement
  // })

  it('should set the selected item ids', () => {
    store.setSelectedItemIds(['vaadin-button']);

    expect(store.selectedItemIds.size).to.be.equal(1);
    expect(store.selectedItemIds.has('vaadin-button')).to.be.true;
  });
});
