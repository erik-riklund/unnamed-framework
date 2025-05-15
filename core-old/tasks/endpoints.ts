import chalk from 'chalk';
import { file, Glob } from 'bun';
import { basename } from 'node:path';
import { createRoutePath } from 'core/router';
import { HttpMethod } from 'module/serve';

/**
 * Initializes the endpoints by scanning the source folder for route files
 * and generating a target file with the route declarations.
 * 
 * @param sourceFolder - The folder containing the route files.
 * @param targetFile - The file where the route declarations will be written.
 */
export const initializeEndpoints = async (sourceFolder: string, targetFile: string) =>
{
  console.log(`\nscanning ${ chalk.yellow(sourceFolder) } for endpoints ...`);

  const imports: string[] = [];
  const endpoints: Record<string, Partial<Record<HttpMethod, string>>> = {};

  const files = new Glob('**/{GET,POST,PUT,PATCH,DELETE}.ts');

  for await (const relativeFilePath of files.scan(sourceFolder))
  {
    const httpMethod = basename(relativeFilePath, '.ts') as HttpMethod;
    const normalizedPath = relativeFilePath.replaceAll(/\\/g, '/');
    const routePath = createRoutePath(normalizedPath, '/api');

    const importId = normalizedPath.replaceAll('/', '__').replace(/\.ts$/, '');
    imports.push(`import ${ importId } from '.${ sourceFolder }/${ normalizedPath }';`);

    if (!endpoints[routePath])
    {
      endpoints[routePath] = {};
    }

    endpoints[routePath][httpMethod] = importId;

    console.log(`  ${ chalk.green(httpMethod) } ${ chalk.yellow(routePath) } -> ${ chalk.cyan(normalizedPath) }`);
  }

  const declarations: string[] = [];

  Object.entries(endpoints).forEach(
    ([routePath, methods]) =>
    {
      Object.entries(methods).forEach(
        ([httpMethod, importId]) =>
        {
          declarations.push(
            `{ path: '${ routePath }', method: HttpMethod.${ httpMethod }, handler: ${ importId } },`
          );
        }
      );
    }
  );

  await file(targetFile).write(
    `// This file is auto-generated. Do not edit it manually.\n\n` +
    `import { HttpMethod } from 'module/serve';\n` +
    'import type { RouteDeclaration } from \'module/serve/types\';\n\n' +
    `export const endpoints: RouteDeclaration[] = [\n${ declarations.join('\n') }\n];\n\n` + imports.join('\n')
  );
};