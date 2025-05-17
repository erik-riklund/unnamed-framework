import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

import type { ComponentDeclaration } from 'types/core';

if (!existsSync('./runtime/components'))
{
  mkdirSync('./runtime/components', { recursive: true });
}

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
        + pipeline.executeTask('compileStylesheet', stylesheet!)

      writeFileSync(targetFilePath, content, { encoding: 'utf-8' });
      print(`  stylesheet for {yellow:${ name }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:skipping stylesheet for "${ name }" (no changes)}`);
    }
  }
);