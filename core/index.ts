import { useServe } from 'module/serve';
import { endpoints } from 'runtime/endpoints';
// import { middlewares } from 'runtime/middlewares';
import { views } from 'runtime/views';

/**
 * ?
 */
useServe(
  {
    // middlewares,
    routes: [ ...endpoints, /*...views*/],

    assets: {
      folder: './app/assets'
    }
  }
);
