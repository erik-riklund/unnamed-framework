import { pipeline } from 'core/build/pipeline';
import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

import type { LayoutDeclaration } from 'types/core';

if (!existsSync('./runtime/layouts'))
{
  mkdirSync('./runtime/layouts', { recursive: true });
}

/**
 * Compile a layout template into a JavaScript module.
 */
export default defineTask(
  ({ name, template, dependencies }: LayoutDeclaration) =>
  {
    const targetFilePath = `./runtime/layouts/${ name }.js`;
    const sourceFileChanged = pipeline.executeTask(
      'compareLastModified', { sourceFilePath: template, targetFilePath }
    );

    if (sourceFileChanged)
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

      content.push(pipeline.executeTask('compileTemplate', { template }));
      writeFileSync(targetFilePath, content.join('\n'), 'utf-8');

      print(`  template {yellow:${ name }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:skipping "${ name }" (no changes)}`);
    }
  }
);