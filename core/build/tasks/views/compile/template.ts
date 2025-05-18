import { pipeline } from 'core/build/pipeline';
import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';

import type { ViewDeclaration } from 'types/core';

/**
 * Compile a layout template into a JavaScript module.
 */
export default defineTask(
  ({ template, dependencies }: ViewDeclaration) =>
  {
    const routePath = pipeline.executeTask('createRoutePath', template);
    const name = Bun.hash(routePath).toString(24);

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

        content.push(
          `export default (self)=>{` +
          `let result=template(self);` +
          `for(const layout of layouts.reverse()){` +
          `result=layout({...self,_content:result});` +
          `}return result;};`
        );
      }
      else
      {
        content.push(`export default ${ compiledTemplate };`);
      }

      pipeline.executeTask('writeFile', { fileName: `views/${ name }.js`, content });
      print(`  {green:${ template }} -> {cyan:${ targetFilePath }}`);
    }
    else
    {
      print(`  {gray:${ template } (no changes)}`);
    }
  }
);