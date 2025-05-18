import { HttpMethod } from 'types/serve';
import type { MiddlewareDeclaration } from 'types/serve';

/**
 * Defines middlewares for the server. These are registered before any middlewares
 * defined in the `routes` folder. They are executed in the order they are defined.
 */
export const middlewares: MiddlewareDeclaration[] = [];