import { pipeline } from 'core/build/pipeline';
import { defineTask } from 'module/pipeline';

import type { ComponentDeclaration, FilePath } from 'types/core';

/**
 * Load the component declaration from a JSON file.
 */
export default defineTask(
  ({ filePath }: FilePath) =>
  {
    const declaration: ComponentDeclaration = pipeline.executeTask('loadJsonFile', { filePath });
    const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));

    declaration.template = `${ folderPath }/${ declaration.template }`;

    if (declaration.stylesheet !== null)
    {
      declaration.stylesheet = `${ folderPath }/${ declaration.stylesheet }`;
    }

    return declaration;
  }
);