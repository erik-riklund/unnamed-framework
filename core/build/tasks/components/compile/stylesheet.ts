import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { ComponentDeclaration } from 'types/core';

/**
 * Compile the stylesheet for a component into a CSS file.
 */
export default defineTask(
  ({ name, stylesheet }: ComponentDeclaration) =>
  {
    if (!stylesheet) return; // no stylesheet to compile.

    const targetFilePath = `./runtime/components/${ name }.css`;
    const sourceFileChanged = pipeline.executeTask(
      'compareLastModified', { sourceFilePath: stylesheet!, targetFilePath }
    );

    if (sourceFileChanged)
    {
      const content = '/* This file is auto-generated. Do not edit. */\n'
        + pipeline.executeTask('compileStylesheet', stylesheet!);

      pipeline.executeTask('writeFile', { fileName: `components/${ name }.css`, content });
      print(`  {yellow:${ name }} {green:${ stylesheet }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:${ stylesheet } (no changes)}`);
    }
  }
);