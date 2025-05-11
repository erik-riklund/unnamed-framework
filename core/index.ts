import { useServe } from 'module/serve';
import { routes } from 'runtime/routes';

/**
 * ?
 */
useServe(
  {
    routes,

    assets: {
      folder: './app/assets'
    }
  }
);