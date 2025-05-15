import { file } from 'bun';
import CleanCSS from 'clean-css';
import { dirname } from 'node:path';
import { PurgeCSS } from 'purgecss';

import type { PageHandler } from './types';
import type { RenderFunction } from 'module/compile/types';
import type { RequestContext } from 'module/serve/types';

/**
 * Creates a route path from a file path.
 * 
 * @param filePath - The path to the file.
 * @param prefix - The prefix to be added to the route path.
 */
export const createRoutePath = (filePath: string, prefix: string = '') =>
{
  const pathSegments: string[] = [];
  const rawPathSegments = (filePath.includes('/') ? dirname(filePath) : '').split('/');

  for (const segment of rawPathSegments)
  {
    if (segment.startsWith('-'))
    {
      continue; // grouping segment, should be ignored.
    }
    else if (segment.startsWith('$'))
    {
      pathSegments.push(`:${ segment.slice(1) }`); // parameter segment.
    }
    else
    {
      pathSegments.push(segment); // static segment.
    }
  }

  return `${ prefix }/${ pathSegments.join('/') }`;
};

/**
 * ?
 */
export const servePage = async (
  pageId: string, view: RenderFunction, context: RequestContext,
  dependencies: string[], handler?: PageHandler) =>
{
  if (typeof handler === 'function')
  {
    context.data = { ...context.data, ...await handler() };
  }

  let renderedView = view(context.data);
  let pageStyles = await loadPageStyles(pageId, dependencies);

  console.log({ pageStyles });

  // 1. Load the stylesheets for the page and its dependencies.
  // 2. Remove unused styles and optimize the stylesheets.
  // 3. Minify and return the rendered view.

  renderedView = renderedView.replace(
    '</head>', `<style>${ pageStyles }</style></head>`
  );

  return context.html(renderedView);
};

/**
 * ?
 */
const loadPageStyles = async (
  pageId: string, dependencies: string[]) =>
{
  const stylesheets: string[] = [];
  const stylesheet = file(`./runtime/pages/${ pageId }.css`);

  if (await stylesheet.exists())
  {
    stylesheets.push(await stylesheet.text());
  }

  // ...

  return stylesheets.join('');
};