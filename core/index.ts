import { useServe } from 'module/serve';
// import { endpoints } from 'runtime/endpoints';
// import { middlewares } from 'runtime/middlewares';
// import { pages } from 'runtime/pages';

/**
 * ?
 */
useServe(
  {
    // middlewares,
    routes: [ /*...endpoints, ...pages*/ ],

    assets: {
      folder: './app/assets'
    }
  }
);
