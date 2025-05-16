import { print } from 'library/helpers/print';
import { compile } from 'module/compile';
import { defineTask } from 'module/pipeline';

import { existsSync, mkdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';

import type { ComponentDeclaration } from 'types/core';
export type CompileTemplateInput = ComponentDeclaration;

/**
 * Ensure the runtime components folder exists.
 */
if (!existsSync('./runtime/components'))
{
  mkdirSync('./runtime/components', { recursive: true });
}

/**
 * Compile a template file into a JavaScript module.
 */
export default defineTask<CompileTemplateInput>(
  (pipeline, input) =>
  {
    const { name, template, dependencies, recursive } = input;

    const targetFilePath = `./runtime/components/${ name }.js`;
    const targetFileChanged = existsSync(targetFilePath) ? statSync(targetFilePath).mtimeMs : 0;
    const sourceFileChanged = statSync(template).mtimeMs;

    if (targetFileChanged < sourceFileChanged)
    {
      const content: string[] = [
        '// This file is auto-generated. Do not edit.',
      ];

      if (dependencies)
      {
        for (const dependency of dependencies)
        {
          const dependencyFilePath = `runtime/components/${ dependency }`;
          content.push(`import __${ dependency } from '${ dependencyFilePath }';`);
        }
      }

      const templateContent = readFileSync(template, 'utf-8');
      const compiledTemplate = compile.toString(templateContent, {}, { recursive });

      content.push(`export default ${ compiledTemplate }`);

      writeFileSync(targetFilePath, content.join('\n'), 'utf-8');
      print(`  template: {yellow:${ name }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:skipping "${ name }" (no changes)}`);
    }
  }
);