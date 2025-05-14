import { file, Glob } from 'bun';
import { minify } from 'html-minifier';
import { dirname } from 'node:path';
import { compileString } from 'sass';
import { createRoutePath } from 'core/router';
import { compile } from 'module/compile';

import type { PageDeclaration } from 'core/types';

/**
 * Initialize the pages by scanning the source folder for `route.json` files,
 * loading their declarations, and generating the corresponding JS files.
 * 
 * @param sourceFolder - The source folder containing the route files.
 * @param targetFolder - The target folder where the generated files will be saved.
 */
export const initializePages = async (
  sourceFolder: string, targetFolder: string) =>
{
  const routes: string[] = [];
  const imports: string[] = [];

  const routeFilePattern = new Glob('**/route.json');

  for await (const relativeFilePath of routeFilePattern.scan(sourceFolder))
  {
    const absoluteFilePath = `${ sourceFolder }/${ relativeFilePath }`;
    const routeDeclaration = await loadRouteDeclaration(absoluteFilePath);
    const routePath = createRoutePath(relativeFilePath);

    const pageId = Bun.hash(routePath).toString(14);
    const { dependencies, handler, template, stylesheet } = routeDeclaration;
    const templateFilePath = `${ sourceFolder }/${ dirname(relativeFilePath) }/${ template }`;

    compileTemplate(templateFilePath, `${ targetFolder }/${ pageId }.js`, dependencies);

    const dependencyList = dependencies.map((dependency) => `'${ dependency }'`).join(', ');
    const requestHandler = `(context) => servePage('${ pageId }', page_${ pageId }, context, [${ dependencyList }]${ handler ? `, handler_${ pageId }` : '' })`;

    routes.push(`{ path: '${ routePath }', method: HttpMethod.GET, handler: ${ requestHandler } },`);
    imports.push(`import page_${ pageId } from 'runtime/pages/${ pageId }';`);

    if (handler)
    {
      const handlerFilePath = `${ dirname(relativeFilePath) }/${ handler }`;
      imports.push(`import handler_${ pageId } from '${ ('page/' + handlerFilePath).replaceAll('/./', '/') }';`);
    }

    if (stylesheet)
    {
      const styleFile = file(
        `${ sourceFolder }/${ dirname(relativeFilePath) }/${ stylesheet }`
      );

      const targetFile = file(`${ targetFolder }/${ pageId }.css`);

      if (!await targetFile.exists() || targetFile.lastModified < styleFile.lastModified)
      {
        const styleContent = await styleFile.text();

        await targetFile.write(compileString(styleContent, { style: 'compressed' }).css);
      }
    }
  }

  await file(`${ targetFolder }.ts`).write(
    `// This file is auto-generated. Do not edit it manually.\n\n` +
    `import { HttpMethod } from 'module/serve';\n` +
    `import { servePage } from 'core/router';\n` +
    `import type { RouteDeclaration } from 'module/serve/types';\n\n` +
    `export const pages: RouteDeclaration[] = [\n${ routes.join('\n') }\n];\n\n`

    + imports.join('\n')
  );
};

/**
 * Load a route declaration from the specified file.
 * 
 * @param filePath - The path to the route declaration file.
 * @returns The parsed route declaration object.
 */
const loadRouteDeclaration = async (
  filePath: string): Promise<PageDeclaration> =>
{
  return JSON.parse(await file(filePath).text());
};

/**
 * Compile a template file and write the output to the target file.
 * 
 * @param sourceFilePath - The path to the source template file.
 * @param targetFilePath - The path to the target output file.
 * @param dependencies - An array of dependencies for the template.
 */
const compileTemplate = async (
  sourceFilePath: string, targetFilePath: string, dependencies: string[]) =>
{
  const content = await file(sourceFilePath).text();
  const minifiedContent = minify(content,
    { removeComments: true, collapseWhitespace: true }
  );

  const compiledTemplate = compile.toString(minifiedContent);

  const imports = dependencies.map((dependency) =>
    `import __${ dependency } from 'runtime/templates/${ dependency }';`
  );

  await file(targetFilePath).write(
    `// This file is auto-generated. Do not edit it manually.\n` +
    `// ${ sourceFilePath.replaceAll('/./', '/') }\n\n` +

    `export default ${ compiledTemplate }\n\n${ imports.join('\n') }`.trim()
  );
};