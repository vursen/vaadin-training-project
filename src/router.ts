import { Router } from '@vaadin/router';

import './layouts/x-default-layout';

import './pages/x-home-page';
import './pages/x-component-page';
import './pages/x-not-found-page';

const outlet = document.getElementById('outlet');

export const router = new Router(outlet);

router.setRoutes([
  {
    path: '',
    component: 'x-default-layout',
    children: [
      {
        path: '/',
        name: 'home',
        component: 'x-home-page',
      },
      {
        path: '/components/:name/',
        name: 'component',
        component: 'x-component-page',
      },
      {
        path: '(.*)',
        component: 'x-not-found-page',
      },
    ],
  },
]);
