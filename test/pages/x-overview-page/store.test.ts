import sinon from 'sinon';
import { when } from 'mobx';
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

  it('should have a gridItems getter', () => {
    expect(store.gridItems).to.have.lengthOf(1);
    expect(store.gridItems[0]).to.include({
      id: 'vaadin-button',
      name: 'vaadin-button',
      npmName: '@vaadin/vaadin-button',
    });
  });

  it(`should calculate the grid items' totals`, () => {
    expect(store.gridItems[0].total).to.equal(218);
    expect(store.gridItems[0].totalOverWeek).to.equal(146);
    expect(store.gridItems[0].totalOverPeriod).to.equal(0);

    expect(store.gridItems[0].weeks).to.have.lengthOf(3);
    expect(store.gridItems[0].weeks[0].total).to.equal(29);
  });

  it(`should calculate the grid items' totals when setting the reference period`, async () => {
    periodStore.setPeriod('2021-03-22|2021-03-29');

    await when(() => periodStore.period !== '');

    expect(store.gridItems[0].totalOverPeriod).to.equal(189);
  });

  it('should set the selected grid items', () => {
    store.setSelectedGridItems(['vaadin-button']);

    expect(store.selectedGridItemIds.size).to.equal(1);
    expect(store.selectedGridItemIds.has('vaadin-button')).to.be.true;
  });
});
