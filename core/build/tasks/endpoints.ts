import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';
import { writeFileSync } from 'node:fs';

import type { TargetFolder } from 'types/core';

/**
 * Builds the endpoints for the application.
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    print(`\nprocessing {magenta:endpoints} @ {yellow:${ targetFolder }}\n`);

    const files = pipeline.executeTask('scanFolder',
      { glob: '**/{GET,POST,PUT,PATCH,DELETE}.ts', targetFolder: './app/routes' }
    );

    const imports: string[] = [];
    const endpoints: string[] = [];

    for (const file of files)
    {
      const method = file.substring(file.lastIndexOf('/'), file.lastIndexOf('.')).slice(1);
      const routePath = pipeline.executeTask('createRoutePath', file);
      const routeId = Bun.hash(routePath).toString(24);

      print(`  GET {cyan:${ routePath }} -> {green:./app/routes/${ file }}`);

      endpoints.push(`{ path: '${ routePath }', method: HttpMethod.${ method }, handler: endpoint_${ routeId } },`);
      imports.push(`import endpoint_${ routeId } from 'route/${ file }';`);
    }

    const content = [
      '// This file is auto-generated. Do not edit manually.',
      'import { HttpMethod } from \'module/serve\';',
      'import type { RouteDeclaration } from \'types/serve\';',
      'export const endpoints: RouteDeclaration[] = [', ...endpoints, '];', ...imports
    ];

    writeFileSync('./runtime/endpoints.ts', content.join('\n'), { encoding: 'utf-8' });
  }
);