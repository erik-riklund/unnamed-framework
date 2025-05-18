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

      const compiledTemplate = pipeline.executeTask('compileTemplate', { template });
      const layouts = pipeline.executeTask('resolveLayouts', { filePath: template });

      if (layouts.length > 0)
      {
        const layoutList: string[] = [];

        for (const { name } of layouts)
        {
          layoutList.push(`layout_${ name }`);

          content.push(`import layout_${ name } from 'runtime/layouts/${ name }';`);
        }

        content.push(`const layouts = [ ${ layoutList.join(', ') } ];`);
        content.push(`const template = ${ compiledTemplate };`);

        content.push(`export default (self) => {`);
        content.push(`let result = template(self);`);
        content.push(`for (const layout of layouts.reverse()) {`);
        content.push(`  result = layout({...self, _content: result});`);
        content.push(`}\nreturn result;\n};`);
      }
      else
      {
        content.push(`export default ${ compiledTemplate };`);
      }

      writeFileSync(targetFilePath, content.join('\n'), 'utf-8');
      print(`  template {gray:${ template }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:skipping "${ template }" (no changes)}`);
    }
  }
);