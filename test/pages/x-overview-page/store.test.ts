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
    sandbox.stub(api, 'fetchComponents').resolves(fixtures.api.components);
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

    await componentsStore.fetchComponents();
    await componentsStore.fetchComponentStatistics('vaadin-button');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should have a gridItems getter', () => {
    expect(store.gridItems).to.have.lengthOf(1);
    expect(store.gridItems[0]).to.include({
      id: 'vaadin-button',
      name: 'vaadin-button',
      npmName: '@vaadin/vaadin-button',
    });
  });

  it('should aggregates the grid item totals', () => {
    expect(store.gridItems[0]).to.include({
      total: 218,
      totalOverWeek: 146,
      totalOverCustomPeriod: 218,
    });

    expect(store.gridItems[0].weeks).to.have.lengthOf(3);
    expect(store.gridItems[0].weeks[0]).to.include({
      date: '15/03/2021',
      total: 29,
    });
  });

  // it('should aggregate the totals of items with the custom period', () => {
  //   // TODO: Implement
  // })

  it('should set the selected grid items', () => {
    store.setSelectedGridItems(['vaadin-button']);

    expect(store.selectedGridItemIds.size).to.equal(1);
    expect(store.selectedGridItemIds.has('vaadin-button')).to.be.true;
  });
});
