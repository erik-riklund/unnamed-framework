//
// --- INTERFACES -------------------------------------------------------------
//

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


export interface ComponentMetadata
{
  /**
   * An array of component names that this component depends on.
   */
  dependencies: string[];

  /**
   * Specifies whether the component has a stylesheet.
   */
  stylesheet: boolean;
}


export interface LayoutDeclaration extends TemplateDeclaration
{
  /**
   * The name of the component, which is used as a key in the component registry.
   */
  name: string;

  /**
   * The path at which the layout should be applied to views.
   */
  basePath: string;
}


export interface LayoutMetadata
{
  /**
   * The path at which the layout should be applied to views.
   */
  basePath: string;

  /**
   * An array of component names that this component depends on.
   */
  dependencies: string[];

  /**
   * Specifies whether the layout has a stylesheet.
   */
  stylesheet: boolean;
}


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


export interface ViewDeclaration extends TemplateDeclaration
{
  /**
   * The file path to the page handler function (optional).
   */
  handler: MaybeNull<string>;
}


export interface ViewMetadata
{
  /**
   * An array of component names that this component depends on.
   */
  dependencies: string[];

  /**
   * ?
   */
  layouts: string[];

  /**
   * An optional stylesheet file to be used for styling the component.
   */
  stylesheet: boolean;
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