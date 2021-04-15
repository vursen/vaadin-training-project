import sinon from 'sinon';
import { expect } from '@open-wc/testing';

import { api } from '../../../src/api';

import { ComponentsStore } from '../../../src/stores/components-store';

import { Store } from '../../../src/pages/x-overview-page/store';

import * as fixtures from '../../fixtures';
import { PeriodStore } from '../../../src/stores/period-store';

describe('overview page store', () => {
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

    await componentsStore.fetchComponents();
    await componentsStore.fetchComponentStatistics('vaadin-button');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should compute grid items', () => {
    expect(store.gridItems).to.have.lengthOf(1);
    expect(store.gridItems[0]).to.include({
      name: 'vaadin-button',
      npmName: '@vaadin/vaadin-button',
    });
  });

  it(`should aggregate the grid item' totals`, () => {
    expect(store.gridItems[0].total).to.equal(218);
    expect(store.gridItems[0].totalOverWeek).to.equal(146);
    expect(store.gridItems[0].totalOverPeriod).to.equal(218);
  });

  it(`should aggregate the grid item' totals when setting the period`, async () => {
    periodStore.setPeriod('2021-03-22|2021-03-29');

    expect(store.gridItems[0].totalOverPeriod).to.equal(189);
  });

  it('should select a grid item', () => {
    store.setSelectedGridItems(['vaadin-button']);

    expect(store.selectedGridItemNames.size).to.equal(1);
    expect(store.selectedGridItemNames.has('vaadin-button')).to.be.true;
  });

  it('should not have any chart items by default', () => {
    expect(store.chartItems).to.have.lengthOf(0);
  });

  it('should compute chart items when selecting a grid item', () => {
    store.setSelectedGridItems(['vaadin-button']);

    expect(store.chartItems).to.have.lengthOf(1);
    expect(store.chartItems[0].weeks).to.have.lengthOf(3);
    expect(store.chartItems[0].weeks[0].total).to.equal(29);
  });
});
