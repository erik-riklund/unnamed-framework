import type { RouteHandler } from 'module/serve/types';

/**
 * ?
 */
export default (
  (context) => context.json({ message: 'Hello world' })
) satisfies RouteHandler;