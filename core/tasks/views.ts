import { file, Glob } from 'bun';
import { dirname } from 'node:path';
import { createRoutePath } from 'core/router';

/**
 * Generates the route declarations for views in the specified source folder
 * and writes them to the specified target file.
 * 
 * @param sourceFolder - The folder containing the view files.
 * @param targetFile - The file to write the generated route declarations to.
 */
export const initializeViews = async (
  sourceFolder: string, targetFile: string) =>
{
  const views: string[] = [];
  const imports: string[] = [];

  const files = new Glob('**/view.fml');

  for await (const relativeFilePath of files.scan(sourceFolder))
  {
    const normalizedPath = relativeFilePath.replaceAll(/\\/g, '/');
    const handlerFilePath = `${ dirname(normalizedPath) }/handler.ts`;

    if (await file(`${ sourceFolder }/${ handlerFilePath }`).exists())
    {
      const handlerId = handlerFilePath.replaceAll('/', '__').replace(/\.ts$/, '');

      views.push(
        `{ path: '${ createRoutePath(normalizedPath) }', method: HttpMethod.GET, `
        + `handler: (context) => serveViewWithHandler('${ normalizedPath }', context, ${ handlerId }) }`
      );

      imports.push(`import ${ handlerId.replace(/^\./, '') } from '.${ sourceFolder }/${ handlerFilePath }';`);
    }
    else
    {
      views.push(
        `{ path: '${ createRoutePath(normalizedPath) }', method: HttpMethod.GET, `
        + `handler: (context) => serveView('${ normalizedPath }', context) }`
      );
    }
  }

  await file(targetFile).write(
    `// This file is auto-generated. Do not edit it manually.\n\n` +
    `import { HttpMethod } from 'module/serve';\n` +
    `import { serveView, serveViewWithHandler } from 'core/router';\n` +
    'import type { RouteDeclaration } from \'module/serve/types\';\n\n' +
    `export const views: RouteDeclaration[] = [\n${ views.join(',\n') }\n];\n\n` + imports.join('\n')
  );
};