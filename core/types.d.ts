/**
 * Represents a route declaration for a page.
 */
export interface PageDeclaration
{
  /**
   * An array of template names that this page depends on.
   */
  dependencies: string[];

  /**
   * An optional handler function that can be used to process the request.
   */
  handler: MaybeNull<string>;

  /**
   * The name of the template file to be used for rendering the page.
   */
  template: string;

  /**
   * An optional stylesheet file to be used for styling the page.
   */
  stylesheet: MaybeNull<string>;
}

/**
 * Represents a view handler function that returns an object or a promise of an object.
 */
export type PageHandler = () => MaybePromise<Record<string, unknown>>;