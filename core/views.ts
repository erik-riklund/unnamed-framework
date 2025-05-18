import CleanCSS from 'clean-css';
import { minify } from 'html-minifier';
import { PurgeCSS } from 'purgecss';
import { readFileSync } from 'node:fs';

import componentMetadata from 'runtime/components.json';
import layoutMetadata from 'runtime/layouts.json';
import viewMetadata from 'runtime/views.json';

import type { RequestContext } from 'types/serve';
import type { RenderFunction } from 'types/compile';
import type { ComponentMetadata, LayoutMetadata, ViewMetadata } from './types';

type ViewHandler = (context: RequestContext) => MaybePromise<void>;

const components = componentMetadata as Record<string, ComponentMetadata>;
const layouts = layoutMetadata as Record<string, LayoutMetadata>;
const views = viewMetadata as Record<string, ViewMetadata>;

/**
 * Render a view with the given context and optional handler.
 * 
 * @param context The request context containing data and other information.
 * @param view The render function for the view to be rendered.
 * @param id The ID of the view to be rendered.
 * @param handler An optional handler function to modify the context before rendering.
 * 
 * @returns The rendered HTML result of the view.
 */
export const renderView = async (context: RequestContext,
  view: RenderFunction, id: string, handler?: ViewHandler) =>
{
  if (typeof handler === 'function')
  {
    await handler(context); // wait for the handler to modify the context.
  }

  let styles = resolveStyles(id);
  let result = view(context.data);

  return context.html(await optimizeResult(result, styles));
};

/**
 * Resolve the styles for a view, loading the stylesheets for the view, its
 * dependencies, and its layouts. The styles are then optimized using CleanCSS.
 * 
 * @param viewId The ID of the view to resolve styles for.
 * @returns The optimized styles for the view.
 */
const resolveStyles = (viewId: string) =>
{
  const view = views[viewId];
  const styles: Record<string, string> = {};
  const cleaner = new CleanCSS({ level: 2 });

  const loadStylesheet = (filePath: string) =>
  {
    return readFileSync(filePath, 'utf-8');
  };

  const loadLayoutStyles = (name: string) =>
  {
    if (name in layouts && !(name in styles))
    {
      const layout = layouts[name];

      styles[name] = loadStylesheet(`./runtime/layouts/${ name }.css`);

      if (layout.dependencies.length > 0)
      {
        layout.dependencies.forEach(
          (component) => loadComponentStyles(component)
        );
      }
    }
  };

  const loadComponentStyles = (name: string) =>
  {
    if (name in components && !(name in styles))
    {
      const component = components[name];

      styles[name] = loadStylesheet(`./runtime/components/${ name }.css`);

      if (component.dependencies.length > 0)
      {
        component.dependencies.forEach(
          (component) => loadComponentStyles(component)
        );
      }
    }
  };

  if (view.layouts.length > 0)
  {
    view.layouts.forEach(
      (layout) => loadLayoutStyles(layout)
    );
  }

  if (view.dependencies.length > 0)
  {
    view.dependencies.forEach(
      (component) => loadComponentStyles(component)
    );
  }

  if (view.stylesheet === true)
  {
    styles[viewId] = loadStylesheet(`./runtime/views/${ viewId }.css`);
  }

  return cleaner.minify(Object.values(styles).join('')).styles;
};

/**
 * Optimize the result of a view by purging unused CSS styles and
 * inlining the optimized styles into the HTML.
 * 
 * @param result The HTML result of the view.
 * @param styles The CSS styles to be optimized.
 * @return The optimized HTML result with inlined styles.
 */
const optimizeResult = async (result: string, styles: string) =>
{
  const cleaner = new PurgeCSS();
  const purgeResult = await cleaner.purge({
    content: [{ raw: result, extension: 'html' }], css: [{ raw: styles }]
  });

  return minify(
    result.replace('</head>', `<style>${ purgeResult[0].css }</style></head>`),
    { collapseWhitespace: true, removeComments: true }
  );
};