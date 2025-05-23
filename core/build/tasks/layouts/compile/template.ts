import { pipeline } from 'core/build/pipeline';
import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';

import type { LayoutDeclaration } from 'types/core';

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

      const compiledLayout = pipeline.executeTask('compileTemplate', { template });
      content.push(`export default ${ compiledLayout };`);
      
      pipeline.executeTask('writeFile', { fileName: `layouts/${ name }.js`, content });

      print(`  {yellow:${ name }} {green:${ template }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:${ template } (no changes)}`);
    }
  }
);