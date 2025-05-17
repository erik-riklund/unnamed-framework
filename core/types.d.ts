//
// --- INTERFACES -------------------------------------------------------------
//

/**
 * Represents a component declaration.
 */
export interface ComponentDeclaration extends TemplateDeclaration
{
  /**
   * The name of the component, which is used as a key in the component registry.
   */
  name: string;

  /**
   * Indicates whether the component should be compiled to enable recursive calls.
   */
  recursive: boolean;
}

/**
 * Represents a component declaration.
 */
export interface LayoutDeclaration extends TemplateDeclaration
{
  /**
   * The name of the component, which is used as a key in the component registry.
   */
  name: string;
}

/**
 * Represents a template declaration.
 */
interface TemplateDeclaration
{
  /**
   * An array of component names that this component depends on.
   */
  dependencies: string[];

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
export interface ViewDeclaration extends TemplateDeclaration
{
  /**
   * The file path to the page handler function (optional).
   */
  handler: MaybeNull<string>;
}

//
// --- TYPES ------------------------------------------------------------------
//

/**
 * Represents an input type for a task that requires a file path.
 */
export type FilePath = { filePath: string; };

/**
 * Represents an input type for a task that requires a folder path.
 */
export type TargetFolder = { targetFolder: string; };

/**
 * Represents a view handler function that returns an object or a promise of an object.
 */
export type PageHandler = () => MaybePromise<Record<string, unknown>>;