import type { BunRequest } from 'bun';

/**
 * Enumeration representing the HTTP methods used in requests.
 */
export enum HttpMethod
{
  /**
   * Used to retrieve a record or a collection of records from the server.
   */
  GET = 'GET',

  /**
   * Sends data to create a new record on the server.
   */
  POST = 'POST',

  /**
   * Sends data to replace an existing record on the server.
   */
  PUT = 'PUT',

  /**
     * Used to partially update an existing record on the server.
     */
  PATCH = 'PATCH',

  /**
   * Used to delete record(s) from the server.
   */
  DELETE = 'DELETE'
}

/**
 * Represents a declaration that associates a handler with a specific path.
 *
 * @template H - The type of the handler function.
 */
interface Declaration<H extends Handler<any>>
{
  /**
   * The handler responsible for processing requests or actions.
   */
  handler: H;

  /**
   * The path or route associated with the handler.
   */
  path: string;
}

/**
 * Represents the context of a request, including its associated data and the request object itself.
 */
export interface RequestContext
{
  /**
   * The data context associated with the request, which can be useful for sharing data between middleware and route handlers.
   */
  data: Record<string, unknown>;

  /**
   * Utility method for sending a HTML response.
   * 
   * @param content - The HTML content to be returned.
   * @returns A promise that resolves to a `Response` object containing the HTML content.
   */
  html: (content: string) => Response;

  /**
   * Utility method for sending a JSON response.
   * 
   * @param data - The JSON data to be returned.
   * @returns A promise that resolves to a `Response` object containing the JSON data.
   */
  json: (data: unknown) => Response;

  /**
   * The request object containing information about the incoming HTTP request.
   */
  request: BunRequest;
}

/**
 * Represents a configuration object used to set up the server's behavior and routing logic.
 */
export interface ServerConfig
{
  /**
   * Optional configuration for serving static assets.
   */
  assets?:
  {
    /**
     * The folder from which to serve static files.
     * - default `./assets`
     */
    folder: string;

    /**
     * The route to serve static files from.
     * - default `/assets/*`
     */
    route: string;
  };

  /**
   * A list of middleware declarations that will be applied to incoming requests.
   * Each middleware declaration should specify the path and handler function for that middleware.
   */
  middlewares?: MiddlewareDeclaration[];

  /**
   * Defines the port on which the server will listen for incoming requests.
   * - default `800`
   */
  port?: number;

  /**
   * A list of route declarations that define the server's routing logic.
   * Each route declaration should specify the HTTP method, path, and handler function for that route.
   */
  routes: RouteDeclaration[];
}

/**
 * Represents a route or middleware handler function that processes incoming requests and returns a response.
 * - The handler can either return a response directly or return a promise that resolves to a response.
 * 
 * @template R - The type of the response returned by the handler.
 */
type Handler<R> = (context: RequestContext) => MaybePromise<R>;

/**
 * Represents a middleware declaration that associates a handler with a specific path.
 */
export type MiddlewareDeclaration = Declaration<MiddlewareHandler>;

/**
 * Represents a middleware handler function that processes incoming requests and potentially intercepts the response.
 */
export type MiddlewareHandler = Handler<MaybeVoid<Response>>;

/**
 * Represents a route declaration that associates a handler with a specific HTTP method and path.
 */
export type RouteDeclaration = Declaration<RouteHandler> & { method: HttpMethod; };

/**
 * Represents a route handler function that processes incoming requests and returns a response.
 */
export type RouteHandler = Handler<Response>;

/**
 * Represents a route pipeline, which is a mapping of route paths to their respective handlers.
 */
export type RoutePipelines = Record<string, {
  [key: string]: (request: BunRequest) => Promise<Response>;
}>;