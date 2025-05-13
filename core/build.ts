import { createRoutes } from './tasks/routes';
import { processTemplates } from './tasks/templates';

/**
 * ?
 */
await Promise.all([
  // createRoutes('./app/routes', './runtime/routes.ts'),
  processTemplates('./app/ui', './runtime/templates')
]);

/**
 * ?
 */
if (process.env.NODE_ENV !== 'production')
{
  // add watchers to rebuild the project on changes.
}