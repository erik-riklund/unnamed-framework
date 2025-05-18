import { print } from 'library/helpers/print';
import { useServe } from 'module/serve';
import { endpoints } from 'runtime/endpoints';
import { middlewares } from 'app/middlewares';
import { middlewares2 } from 'runtime/middlewares';
import { routes } from 'runtime/routes';

print(`${ '\n'.repeat(60) }{gray:${ '-'.repeat(80) }}\n`);

/**
 * * Initialize the server with the provided configuration.
 */
useServe(
  {
    routes: [...endpoints, ...routes],
    middlewares: [...middlewares, ...middlewares2],
    
    assets: { folder: './app/assets' }
  }
);
