import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { TargetFolder, ViewDeclaration } from 'types/core';

/**
 * ?
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    const declarations: ViewDeclaration[] = [];

    const files = pipeline.executeTask(
      'scanFolder', { glob: '**/view.json', targetFolder }
    );

    for (const relativeFilePath of files)
    {
      const filePath = `${ targetFolder }/${ relativeFilePath }`;

      declarations.push(
        pipeline.executeTask('loadViewDeclaration', { filePath })
      );
    }

    return declarations;
  }
);