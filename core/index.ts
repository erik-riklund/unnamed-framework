import { useServe } from 'module/serve';
import { endpoints } from 'runtime/endpoints';
import { middlewares } from 'app/middlewares';
import { middlewares2 } from 'runtime/middlewares';
import { routes } from 'runtime/routes';

/**
 * ?
 */
useServe(
  {
    middlewares: [
      ...middlewares, ...middlewares2
    ],
    routes: [
      ...endpoints, ...routes
    ],
    assets: { folder: './app/assets' }
  }
);
