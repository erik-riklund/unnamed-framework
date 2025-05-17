import { pipeline } from 'core/build/pipeline';
import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { writeFileSync } from 'node:fs';

import type { ViewDeclaration } from 'types/core';

/**
 * Compile a layout template into a JavaScript module.
 */
export default defineTask(
  ({ template, dependencies }: ViewDeclaration) =>
  {
    const name = Bun.hash(template).toString(24);

    const targetFilePath = `./runtime/views/${ name }.js`;
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

      const layouts = pipeline.executeTask('resolveLayouts', { filePath: template });
      
      if (layouts.length > 0)
      {
        // resolve rendering of layouts + the view ...
      }
      else
      {
        const compiledTemplate = pipeline.executeTask('compileTemplate', { template })
        content.push(`export default ${ compiledTemplate };`);
      }

      writeFileSync(targetFilePath, content.join('\n'), 'utf-8');
      print(`  template {yellow:${ template }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:skipping "${ template }" (no changes)}`);
    }
  }
);