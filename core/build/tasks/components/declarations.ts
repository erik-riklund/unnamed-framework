import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { ComponentDeclaration, TargetFolder } from 'types/core';

/**
 * Reads component declarations from JSON files in the specified folder.
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    const declarations: ComponentDeclaration[] = [];

    const { files } = pipeline.executeTask(
      'scanFolder', { glob: '**/component.json', targetFolder }
    );

    for (const relativeFilePath of files)
    {
      const filePath = `${ targetFolder }/${ relativeFilePath }`;

      declarations.push(
        pipeline.executeTask('loadComponentDeclaration', { filePath })
      );
    }

    return declarations;
  }
);