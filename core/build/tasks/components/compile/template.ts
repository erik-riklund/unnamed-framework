import { pipeline } from 'core/build/pipeline';
import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';

import type { ComponentDeclaration } from 'types/core';

/**
 * Compile a template file into a JavaScript module.
 */
export default defineTask(
  ({ name, template, dependencies, recursive }: ComponentDeclaration) =>
  {
    const targetFilePath = `./runtime/components/${ name }.js`;
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

      const compiledTemplate = pipeline.executeTask('compileTemplate', { template, recursive })
      content.push(`export default ${ compiledTemplate };`);
      
      pipeline.executeTask('writeFile', { fileName: `components/${ name }.js`, content });
      
      print(`  {yellow:${ name }} {green:${template}} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:${template} (no changes)}`);
    }
  }
);