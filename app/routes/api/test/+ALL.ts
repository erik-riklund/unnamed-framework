import { defineMiddleware } from 'module/serve';

/**
 * ?
 */
export default defineMiddleware(
  async (context) => context.json({ message: 'intercepted' })
);