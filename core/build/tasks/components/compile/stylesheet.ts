import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import type { ComponentDeclaration } from 'types/core';

/**
 * Ensure the runtime components folder exists.
 */
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
    const targetFilePath = `./runtime/components/${ name }.css`;
    const targetFileChanged = existsSync(targetFilePath) ? statSync(targetFilePath).mtimeMs : 0;
    const sourceFileChanged = statSync(stylesheet!).mtimeMs;

    if (targetFileChanged < sourceFileChanged)
    {
      const content = '/* This file is auto-generated. Do not edit. */\n'
        + pipeline.executeTask('compileScss', readFileSync(stylesheet!, 'utf-8'))

      writeFileSync(targetFilePath, content, { encoding: 'utf-8' });
      print(`  stylesheet for {yellow:${ name }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:skipping stylesheet for "${ name }" (no changes)}`);
    }
  }
);