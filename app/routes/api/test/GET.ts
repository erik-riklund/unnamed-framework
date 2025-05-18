import { defineRouteHandler } from 'module/serve';

/**
 * ?
 */
export default defineRouteHandler(
  (context) => context.json({ message: 'Hello world' })
);