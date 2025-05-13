import { dirname } from 'node:path';
import type { RequestContext } from 'module/serve/types';
import { serve } from 'bun';

/**
 * Creates a route path from a file path.
 * 
 * @param filePath - The path to the file.
 * @param prefix - The prefix to be added to the route path.
 */
export const createRoutePath = (filePath: string, prefix: string = '') =>
{
  const pathSegments: string[] = [];
  const rawPathSegments = (filePath.includes('/') ? dirname(filePath) : '').split('/');

  for (const segment of rawPathSegments)
  {
    if (segment.startsWith('-'))
    {
      continue; // grouping segment, should be ignored.
    }
    else if (segment.startsWith('$'))
    {
      pathSegments.push(`:${ segment.slice(1) }`); // parameter segment.
    }
    else
    {
      pathSegments.push(segment); // static segment.
    }
  }

  return `${ prefix }/${ pathSegments.join('/') }`;
};

/**
 * ?
 */
export const serveView = async (viewPath: string, context: RequestContext) =>
{
  return context.html('Hello world');
};

/**
 * Serves a view that is accompanied by a handler.
 * 
 * @param viewPath - The path to the view file.
 * @param context - The request context.
 * @param handler - The handler function that returns a promise of data to be merged into the context.
 */
export const serveViewWithHandler = async (
  viewPath: string, context: RequestContext,
  handler: () => MaybePromise<Record<string, unknown>>) =>
{
  context.data = { ...context.data, ...await handler() };

  return serveView(viewPath, context);
};