export { };

declare global
{
  /**
   * Represents a value that may be null.
   */
  type MaybeNull<T> = T | null;

  /**
   * Represents a value that may be void.
   */
  type MaybeVoid<T> = T | void;

  /**
   * Represents a value that may be undefined.
   */
  type Optional<T> = T | undefined;

  /**
   * Represents a value that may be a promise.
   */
  type MaybePromise<T> = T | Promise<T>;
}