import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';
import { writeFileSync } from 'node:fs';

import type { TargetFolder } from 'types/core';

/**
 * Builds the middlewares for the application.
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    print(`\nprocessing {magenta:middlewares} @ {yellow:${ targetFolder }}\n`);

    const files = pipeline.executeTask('scanFolder',
      { glob: '**/+{ALL,GET,POST,PUT,PATCH,DELETE}.ts', targetFolder }
    );

    const imports: string[] = [];
    const middlewares: string[] = [];

    for (const file of files)
    {
      const method = file.substring(file.lastIndexOf('+') + 1, file.lastIndexOf('.'));
      const routePath = pipeline.executeTask('createRoutePath', file);
      const routeId = Bun.hash(file).toString(24);

      const httpMethod = method === 'ALL' ? `'ALL' as HttpMethod` : `HttpMethod.${ method }`;
      middlewares.push(`{ path:'${ routePath }', method: ${ httpMethod }, handler: handler_${ routeId } },`);
      imports.push(`import handler_${ routeId } from 'route/${ file }';`);
    }

    const content = [
      '// This file is auto-generated. Do not edit manually.',
      'import { HttpMethod } from \'module/serve\';',
      'import type { MiddlewareDeclaration } from \'types/serve\';',
      'export const middlewares2: MiddlewareDeclaration[] = [', ...middlewares, '];', ...imports
    ];

    writeFileSync('./runtime/middlewares.ts', content.join('\n'), { encoding: 'utf-8' });
  }
);