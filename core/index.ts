import { useServe } from 'module/serve';
import { endpoints } from 'runtime/endpoints';
// import { middlewares } from 'runtime/middlewares';
import { routes } from 'runtime/routes';

/**
 * ?
 */
useServe(
  {
    /*middlewares,*/
    routes: [...endpoints, ...routes],
    assets: { folder: './app/assets' }
  }
);
