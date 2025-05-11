import type {
  MiddlewareDeclaration,
  MiddlewareHandler,
  RequestContext,
  RouteDeclaration,
  RoutePipelines,
  ServerConfig
} from './types';

import chalk from 'chalk'
import { file, serve, type BunRequest } from 'bun';
export { middleware } from './middleware';
export { HttpMethod } from './types.d';

/**
 * Creates a server instance using the HTTP server provided by Bun.
 * 
 * @param config - The server configuration object containing routes, middlewares, and other settings.
 */
export const useServe = (
  { assets, middlewares, port, routes }: ServerConfig) =>
{
  const assetOptions = {
    folder: assets?.folder || './assets',
    route: assets?.route || '/assets/*'
  };

  serve(
    {
      routes:
      {
        [assetOptions.route]:
        {
          GET: (request) =>
          {
            const url = new URL(request.url);
            const path = url.pathname.substring(assetOptions.route.length - 1);

            return staticFileResponse(`${ assetOptions.folder }/${ path }`);
          },
        },

        ...createRoutePipelines(routes, middlewares || []),
      },

      port: process.env.PORT || port || 800,
    }
  );

  console.log(chalk.yellow(`Server is running on port ${ process.env.PORT || port || 800 }:`));
  console.log(`> serving static files from "${ assetOptions.folder }" at '${ assetOptions.route }'`);
};

/**
 * Creates a mapping of route paths to their respective pipelines.
 * 
 * @param routes - A list of route declarations.
 * @param middlewares - A list of middleware declarations.
 */
const createRoutePipelines = (routes: RouteDeclaration[],
  middlewares: MiddlewareDeclaration[]): RoutePipelines =>
{
  const pipelines: RoutePipelines = {};

  /**
   * Creates a middleware stack for a given route path.
   * 
   * @param routePath - The path of the route for which to create the middleware stack.
   * @return An array of middleware handlers that should be executed for the given route path.
   */
  const createMiddlewareStack = (routePath: string) =>
  {
    const stack: MiddlewareHandler[] = [];

    for (const { path, handler } of middlewares)
    {
      if (path === '*' || path === routePath || routePath.startsWith(`${ path }/`))
      {
        stack.push(handler); // the middleware is added to the stack.
      }
    }

    return stack;
  };

  /**
   * Creates a request context object that contains the request and response methods.
   */
  const createRequestContext = (request: BunRequest): RequestContext =>
  {
    const methods = {
      json: (data: unknown) => jsonResponse(data),
      html: (content: string) => htmlResponse(content)
    };

    return { request, data: {}, ...methods };
  };

  /**
   * Creates a pipeline for each route, combining the middleware and the route handler.
   */
  for (const { path, method, handler } of routes)
  {
    const middlewareStack = createMiddlewareStack(path);

    pipelines[path] =
    {
      [method as string]: async (request) =>
      {
        const context = createRequestContext(request);

        for (const middleware of middlewareStack)
        {
          const response = await middleware(context);

          if (response instanceof Response)
          {
            return response; // return the intercepted response.
          }
        }

        return await handler(context);
      }
    };
  }

  return pipelines;
};

/**
 * Creates a `Response` object with JSON content and appropriate headers.
 * 
 * @param data - The JSON data to be returned.
 */
export const jsonResponse = (data: unknown) =>
{
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
};

/**
 * Creates a `Response` object with HTML content and appropriate headers.
 * 
 * @param content - The HTML content to be returned.
 */
export const htmlResponse = (content: string) =>
{
  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
};

/**
 * Creates a `Response` object that serves a static file.
 * 
 * @param filePath - The path to the static file.
 * @returns `Promise` that resolves to a `Response` object with the requested file,
 *          or a `404` error if the file does not exist.
 */
const staticFileResponse = async (filePath: string) =>
{
  try
  {
    const assetFile = file(filePath);
    const fileExists = await assetFile.exists();

    return new Response(
      fileExists ? assetFile : null, { status: fileExists ? 200 : 404 }
    );
  }
  catch (error)
  {
    return new Response(null, { status: 500 });
  }
};
