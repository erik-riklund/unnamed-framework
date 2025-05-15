import chalk from 'chalk';
import { file, Glob } from 'bun';
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
  console.log(`\nscanning ${ chalk.yellow(sourceFolder) } for pages ...`);

  const routes: string[] = [];
  const imports: string[] = [];

  const routeFilePattern = new Glob('**/route.json');

  for await (const relativeFilePath of routeFilePattern.scan(sourceFolder))
  {
    const normalizedPath = relativeFilePath.replaceAll('\\', '/');
    const absoluteFilePath = `${ sourceFolder }/${ normalizedPath }`;

    const routePath = createRoutePath(normalizedPath);
    const { dependencies, handler } = await loadRouteDeclaration(absoluteFilePath);
    const pageId = Bun.hash(routePath).toString(14);

    const dependencyList = dependencies.map((dependency) => `'${ dependency }'`).join(', ');
    const requestHandler = `(context) => servePage('${ pageId }', page_${ pageId }, `
      + `context, [${ dependencyList }]${ handler ? `, handler_${ pageId }` : '' })`;

    routes.push(`{ path: '${ routePath }', method: HttpMethod.GET, handler: ${ requestHandler } },`);
    imports.push(`import page_${ pageId } from 'runtime/pages/${ pageId }';`);

    if (handler)
    {
      const handlerFilePath = `${ dirname(normalizedPath) }/${ handler }`;
      imports.push(`import handler_${ pageId } from '${ ('page/' + handlerFilePath).replaceAll('/./', '/') }';`);
    }

    console.log(`  ${ chalk.green('GET') } ${ chalk.yellow(routePath) } -> ${ chalk.cyan(pageId) }`);
  }

  await file(`${ targetFolder }.ts`).write(
    `// This file is auto-generated. Do not edit it manually.\n\n` +
    `import { HttpMethod } from 'module/serve';\n` +
    `import { servePage } from 'core/router';\n` +
    `import type { RouteDeclaration } from 'module/serve/types';\n\n` +
    `export const pages: RouteDeclaration[] = [\n${ routes.join('\n') }\n];\n\n`

    + imports.join('\n')
  );

  // for await (const relativeFilePath of routeFilePattern.scan(sourceFolder))
  // {
  //   const normalizedPath = relativeFilePath.replaceAll('\\', '/');
  //   console.log(`  ?`);

  //   const absoluteFilePath = `${ sourceFolder }/${ normalizedPath }`;
  //   const routeDeclaration = await loadRouteDeclaration(absoluteFilePath);
  //   const routePath = createRoutePath(normalizedPath);

  //   const pageId = Bun.hash(routePath).toString(14);
  //   const { dependencies, handler, template, stylesheet } = routeDeclaration;
  //   const templateFilePath = `${ sourceFolder }/${ dirname(normalizedPath) }/${ template }`;

  //   compileTemplate(templateFilePath, `${ targetFolder }/${ pageId }.js`, dependencies);

  //   const dependencyList = dependencies.map((dependency) => `'${ dependency }'`).join(', ');
  //   const requestHandler = `(context) => servePage('${ pageId }', page_${ pageId }, context, [${ dependencyList }]${ handler ? `, handler_${ pageId }` : '' })`;

  //   routes.push(`{ path: '${ routePath }', method: HttpMethod.GET, handler: ${ requestHandler } },`);
  //   imports.push(`import page_${ pageId } from 'runtime/pages/${ pageId }';`);

  //   if (handler)
  //   {
  //     const handlerFilePath = `${ dirname(normalizedPath) }/${ handler }`;
  //     imports.push(`import handler_${ pageId } from '${ ('page/' + handlerFilePath).replaceAll('/./', '/') }';`);
  //   }

  //   if (stylesheet)
  //   {
  //     const styleFile = file(
  //       `${ sourceFolder }/${ dirname(normalizedPath) }/${ stylesheet }`
  //     );

  //     const targetFilePath = `${ targetFolder }/${ pageId }.css`;
  //     const targetFile = file(targetFilePath);

  //     if (!await targetFile.exists() || targetFile.lastModified < styleFile.lastModified)
  //     {
  //       console.log(`  ${ chalk.green('stylesheet') } ${ chalk.yellow(stylesheet) } -> ${ chalk.cyan(targetFilePath) }`);

  //       await targetFile.write(compileString(await styleFile.text(), { style: 'compressed' }).css);
  //     }
  //     else
  //     {
  //       console.log(chalk.gray(`  skipping styles for page "${ routePath }" (no changes)`));
  //     }
  //   }
  // }

  // await file(`${ targetFolder }.ts`).write(
  //   `// This file is auto-generated. Do not edit it manually.\n\n` +
  //   `import { HttpMethod } from 'module/serve';\n` +
  //   `import { servePage } from 'core/router';\n` +
  //   `import type { RouteDeclaration } from 'module/serve/types';\n\n` +
  //   `export const pages: RouteDeclaration[] = [\n${ routes.join('\n') }\n];\n\n`

  //   + imports.join('\n')
  // );
};

/**
 * ?
 */
export const processPageTemplates = async (
  sourceFolder: string, targetFolder: string) =>
{
  console.log(`\nscanning ${ chalk.yellow(sourceFolder) } for templates ...`);

  const routeFilePattern = new Glob('**/route.json');

  for await (const relativeFilePath of routeFilePattern.scan(sourceFolder))
  {
    const normalizedPath = relativeFilePath.replaceAll('\\', '/');
    const absoluteFilePath = `${ sourceFolder }/${ normalizedPath }`;

    const routePath = createRoutePath(normalizedPath);
    const { dependencies, template, stylesheet } = await loadRouteDeclaration(absoluteFilePath);
    const pageId = Bun.hash(routePath).toString(14);

    const templateFilePath = `${ sourceFolder }/${ dirname(normalizedPath) }/${ template }`;
    await compileTemplate(templateFilePath, `${ targetFolder }/${ pageId }.js`, dependencies);

    if (stylesheet)
    {
      const styleFile = file(
        `${ sourceFolder }/${ dirname(normalizedPath) }/${ stylesheet }`
      );

      const targetFilePath = `${ targetFolder }/${ pageId }.css`;
      const targetFile = file(targetFilePath);

      if (!await targetFile.exists() || targetFile.lastModified < styleFile.lastModified)
      {
        console.log(`  ${ chalk.green('stylesheet') } ${ chalk.yellow(stylesheet) } -> ${ chalk.cyan(targetFilePath) }`);

        await targetFile.write(compileString(await styleFile.text(), { style: 'compressed' }).css);
      }
      else
      {
        console.log(chalk.gray(`  skipping styles for page "${ routePath }" (no changes)`));
      }
    }
  }

  // ...
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
  const sourceFile = file(sourceFilePath);
  const targetFile = file(targetFilePath);

  if (!await targetFile.exists() || targetFile.lastModified < sourceFile.lastModified)
  {
    console.log(`  ${ chalk.green('template') } ${ chalk.yellow(
      sourceFilePath) } -> ${ chalk.cyan(targetFilePath) }`);

    const content = await sourceFile.text();
    const compiledTemplate = compile.toString(content);

    await targetFile.write(
      `// This file is auto-generated. Do not edit it manually.\n` +
      `// ${ sourceFilePath.replaceAll('/./', '/') }\n\n` +

      `export default ${ compiledTemplate }\n\n`
    );
  }
  else
  {
    console.log(chalk.gray(`  skipping "${ sourceFilePath }" (no changes)`));
  }
};