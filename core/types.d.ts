/**
 * Represents a component declaration.
 */
export interface ComponentDeclaration
{
  /**
   * An array of component names that this component depends on.
   */
  dependencies: string[];

  /**
   * The name of the component, which is used as a key in the component registry.
   */
  name: string;

  /**
   * Indicates whether the component should be compiled to enable recursive calls.
   */
  recursive: boolean;

  /**
   * An optional stylesheet file to be used for styling the component.
   */
  stylesheet: MaybeNull<string>;

  /**
   * The name of the template file to be used for rendering the component.
   */
  template: string;
}

/**
 * Represents a route declaration for a page (view).
 */
export interface PageDeclaration
{
  /**
   * An array of template names that this page depends on.
   */
  dependencies: string[];

  /**
   * The file path to the page handler function (optional).
   */
  handler: MaybeNull<string>;

  /**
   * An optional stylesheet file to be used for styling the page.
   */
  stylesheet: MaybeNull<string>;

  /**
   * The name of the template file to be used for rendering the page.
   */
  template: string;
}

/**
 * Represents a view handler function that returns an object or a promise of an object.
 */
export type PageHandler = () => MaybePromise<Record<string, unknown>>;