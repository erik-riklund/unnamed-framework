import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { TargetFolder } from 'types/core';

/**
 * Compile the view templates/stylesheets and generate the route declarations.
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    print(`\ncompiling {magenta:views} @ {yellow:${ targetFolder }}\n`);

    const declarations = pipeline.executeTask(
      'getViewDeclarations', { targetFolder }
    );

    for (const view of declarations)
    {
      pipeline.executeTask('compileViewTemplate', view);
      pipeline.executeTask('compileViewStylesheet', view);
    }

    print(`\nprocessing {magenta:routes} @ {yellow:${ targetFolder }}\n`);

    const routes: string[] = [];
    const imports: string[] = [];

    for (const view of declarations)
    {
      let routeHandler = '';
      const routePath = pipeline.executeTask('createRoutePath', view.template);
      const routeId = Bun.hash(routePath).toString(24);

      print(`  {green:${ view.template }} -> GET {cyan:${ routePath }}`);

      if (view.handler !== null)
      {
        routeHandler = `, handler_${ routeId }`;

        const relativePath = view.handler.replace(/^\.\/app\/routes\//, '');
        imports.push(`import handler_${ routeId } from 'route/${ relativePath }';`);
      }

      const handler = `renderView(context, view_${ routeId }, '${ routeId }'${ routeHandler })`;
      routes.push(`{ path: '${ routePath }', method: HttpMethod.GET, handler: (context) => ${ handler } },`);
      imports.push(`import view_${ routeId } from 'runtime/views/${ routeId }';`);
    }

    const content = [
      '// This file is auto-generated. Do not edit manually.',
      'import { renderView } from \'core/views\';',
      'import { HttpMethod } from \'module/serve\';',
      'import type { RouteDeclaration } from \'types/serve\';\n',
      'export const routes: RouteDeclaration[] = [', ...routes, '];\n', ...imports
    ];

    pipeline.executeTask('writeFile', { fileName: 'routes.ts', content });
    pipeline.executeTask('saveViewMetadata', declarations);
  }
);