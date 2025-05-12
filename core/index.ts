import { useServe } from 'module/serve';
import { middlewares } from 'runtime/middlewares';
import { routes } from 'runtime/routes';

/**
 * ?
 */
useServe(
  {
    middlewares,
    routes,

    assets: {
      folder: './app/assets'
    }
  }
);