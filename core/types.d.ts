/**
 * Represents a view handler function that returns an object or a promise of an object.
 */
export type ViewHandler = () => MaybePromise<Record<string, unknown>>;