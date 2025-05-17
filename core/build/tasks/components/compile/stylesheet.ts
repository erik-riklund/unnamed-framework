import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { compileString, type StringOptions } from 'sass';

import type { ComponentDeclaration } from 'types/core';

/**
 * Ensure the runtime components folder exists.
 */
if (!existsSync('./runtime/components'))
{
  mkdirSync('./runtime/components', { recursive: true });
}

/**
 * Options for the Sass compiler.
 */
const compileOptions: StringOptions<'sync'> =
{
  charset: false,
  style: 'expanded',
  sourceMap: false,

  loadPaths: [] // array of paths used to resolve imports.
};

/**
 * Compile the stylesheet for a component into a CSS file.
 */
export default defineTask<ComponentDeclaration>(
  (pipeline, input) =>
  {
    const { name, stylesheet } = input;

    const targetFilePath = `./runtime/components/${ name }.css`;
    const targetFileChanged = existsSync(targetFilePath) ? statSync(targetFilePath).mtimeMs : 0;
    const sourceFileChanged = statSync(stylesheet!).mtimeMs;

    if (targetFileChanged < sourceFileChanged)
    {
      const content = '/* This file is auto-generated. Do not edit. */\n'
        + compileString(readFileSync(stylesheet!, 'utf-8'), compileOptions).css;

      writeFileSync(targetFilePath, content, { encoding: 'utf-8' });
      print(`  stylesheet for {yellow:${ name }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:skipping stylesheet for "${ name }" (no changes)}`);
    }
  }
);