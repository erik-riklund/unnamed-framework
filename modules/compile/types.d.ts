/**
 * Represents an element parser that matches a specific pattern in a template.
 */
export interface Element
{
  pattern: RegExp;
  replacement: string | (
    (substring: string, ...args: string[]) => string
  );
}

/**
 * Options that may be passed to the compiler to customize its behavior.
 */
export interface Options
{
  /**
   * Specifies whether to include helper functions in the compiled output.
   */
  helpers?: boolean;
  
  /**
   * Specifies whether a component is able to call itself recursively.
   */
  recursive?: boolean;
}

/**
 * A generic template context object passed to render functions.
 */
export type Context = Record<string, unknown>;

/**
 * A collection of named component templates passed to the compiler. Each key represents
 * a component name, and each value is a template string or a precompiled render function.
 */
export type Dependencies = Record<string, Template>;

/**
 * A compiled render function returned by the compiler.
 *
 * @param self - The local rendering context for the current template.
 * @param parent - The parent context, used to resolve named slots and inherited data.
 * @returns The final rendered HTML string.
 */
export type RenderFunction = (self?: Context, parent?: Context) => string;

/**
 * A string-based template to be compiled into a render function.
 */
export type Template = string;