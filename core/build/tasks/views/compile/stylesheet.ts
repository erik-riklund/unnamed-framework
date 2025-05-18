import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { ViewDeclaration } from 'types/core';

/**
 * Compile the stylesheet for a component into a CSS file.
 */
export default defineTask(
  ({ template, stylesheet }: ViewDeclaration) =>
  {
    if (!stylesheet) return; // no stylesheet to compile.

    const routePath = pipeline.executeTask('createRoutePath', template);
    const routeId = Bun.hash(routePath).toString(24);

    const targetFilePath = `./runtime/views/${ routeId }.css`;
    const sourceFileChanged = pipeline.executeTask(
      'compareLastModified', { sourceFilePath: stylesheet!, targetFilePath }
    );

    if (sourceFileChanged)
    {
      const content = '/* This file is auto-generated. Do not edit. */\n'
        + pipeline.executeTask('compileStylesheet', stylesheet!);

      pipeline.executeTask('writeFile', { fileName: `views/${ routeId }.css`, content });
      print(`  {green:${ stylesheet }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:${ stylesheet } (no changes)}`);
    }
  }
);