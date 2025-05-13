import type { RouteHandler } from 'module/serve/types';

/**
 * GET /api/test
 */
export default (
  (context) => context.json({ message: 'Hello world' })
) satisfies RouteHandler;