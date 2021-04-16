import { Commands, Context, Router, ActionResult } from '@vaadin/router';

import './pages/x-error-page';

interface PageComponent {
  fetch?: (
    context: Context,
    commands: Commands
  ) => ActionResult | Promise<ActionResult>;
}

interface FetchOptions {
  name: string;
  page: () => Promise<PageComponent>;
}

/**
 * Imports the page module, calls the exported `fetch` function and
 * then renders the page into the outlet. Renders the error page instead
 * if an exception is thrown during the data fetching.
 */
function fetch(options: FetchOptions) {
  const { name, page } = options;

  return async (context: Context, commands: Commands) => {
    try {
      const { fetch } = await page();

      if (fetch) {
        const command = await fetch(context, commands);

        if (command) {
          return command;
        }
      }

      return commands.component(name);
    } catch (err) {
      // TODO: Look for a better way of handling errors while the page date is fetching
      // eslint-disable-next-line no-console
      console.error(err);

      return commands.component('x-error-page');
    }
  };
}

/**
 * The Vaadin Router instance that renders components to `#outlet` element
 */
export const router = new Router(document.querySelector('#outlet'));

router.setRoutes([
  {
    path: '',
    action: fetch({
      name: 'x-default-layout',
      page: () => import('./layouts/x-default-layout'),
    }),
    children: [
      {
        path: '/',
        name: 'overview',
        action: fetch({
          name: 'x-overview-page',
          page: () => import('./pages/x-overview-page'),
        }),
      },
      {
        path: '/components/:name/',
        name: 'component',
        action: fetch({
          name: 'x-component-page',
          page: () => import('./pages/x-component-page'),
        }),
      },
    ],
  },
  {
    path: '(.*)',
    component: 'x-not-found-page',
  },
]);
