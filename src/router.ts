import { Router } from '@vaadin/router';

import './layouts/x-default-layout.js';

import './pages/x-home-page.js';
import './pages/x-component-page.js';
import './pages/x-not-found-page.js';

const outlet = document.getElementById('outlet');

export const router = new Router(outlet);

router.setRoutes([
  {
    path: '',
    component: 'x-default-layout',
    children: [
      {
        path: '/',
        component: 'x-home-page',
      },
      {
        path: '/components/:name/',
        component: 'x-component-page',
      },
      {
        path: '(.*)',
        component: 'x-not-found-page',
      },
    ],
  },
]);
