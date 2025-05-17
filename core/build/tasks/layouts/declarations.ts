import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { LayoutDeclaration, TargetFolder } from 'types/core';

/**
 * ?
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    const declarations: LayoutDeclaration[] = [];

    const files = pipeline.executeTask(
      'scanFolder', { glob: '**/layout.json', targetFolder }
    );

    for (const relativeFilePath of files)
    {
      const filePath = `${ targetFolder }/${ relativeFilePath }`;

      declarations.push(
        pipeline.executeTask('loadLayoutDeclaration', { filePath })
      );
    }

    return declarations;
  }
);